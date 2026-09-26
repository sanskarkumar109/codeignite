var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { GoogleGenAI } = require('@google/genai');
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const secret = "secret"; // secret key for jwt

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({ success: false, message: "Email already exists" });
  }
  else {

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        let user = userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash
        });

        return res.json({ success: true, message: "User created successfully" });
      });
    });

  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  if (user) {
    // Rename the second `res` to avoid conflict
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        return res.json({ success: false, message: "An error occurred", error: err });
      }
      if (isMatch) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
      } else {
        return res.json({ success: false, message: "Invalid email or password" });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getUserDetails", async (req, res) => {
  console.log("Called")
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({ success: true, message: "User details fetched successfully", user: user });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });


    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/deleteProject", async (req, res) => {
  let {userId, progId} = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  }
  else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProject", async (req, res) => {
  let {userId,projId} = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOne({ _id: projId });
    return res.json({ success: true, message: "Project fetched successfully", project: project });
  }
  else{
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/updateProject", async (req, res) => {
  let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });

  if (user) {
    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true } // This option returns the updated document
    );

    if (project) {
      return res.json({ success: true, message: "Project updated successfully" });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/generateCode", async (req, res) => {
  let { prompt, projectTitle, currentHtml, currentCss, currentJs } = req.body;
  if (!prompt || prompt.trim() === "") {
    return res.json({ success: false, message: "Prompt is required" });
  }

  let apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    return res.json({
      success: false,
      message: "Please add your OPENROUTER_API_KEY to backend/.env file to use OpenRouter AI!"
    });
  }

  let model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";

  const systemMessage = `You are an expert full-stack web developer assistant for CodeIgnite IDE.
You are helping a developer build/modify a web application project.

PROJECT INFORMATION:
- Project Title / Topic: "${projectTitle || "Untitled Project"}"

CURRENT EXISTING CODE IN EDITOR:
--- HTML ---
${currentHtml && currentHtml.trim() ? currentHtml : "(empty / none)"}

--- CSS ---
${currentCss && currentCss.trim() ? currentCss : "(empty / none)"}

--- JS ---
${currentJs && currentJs.trim() ? currentJs : "(empty / none)"}

CONTEXT-AWARE GENERATION RULES:
1. Pay strict attention to the Project Title/Topic ("${projectTitle || "Untitled Project"}") to keep the design, theme, and feature set relevant to what the user is working on.
2. If the user prompt asks to modify, extend, or add features to their existing project (e.g. "add dark mode", "add search bar", "change theme to dark purple"), PRESERVE their existing code structure and intelligently integrate the requested additions.
3. If the user asks to build something entirely new, generate the new code matching the project topic.
4. Return ONLY a valid raw JSON object (WITHOUT markdown blocks like \`\`\`json) with exactly three keys:
{
  "htmlCode": "HTML code",
  "cssCode": "CSS code",
  "jsCode": "JavaScript code"
}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://codeignite.dev",
        "X-Title": "CodeIgnite Web IDE",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: `User Prompt: "${prompt}"` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.json({
        success: false,
        message: "OpenRouter API error: " + (data.error.message || JSON.stringify(data.error))
      });
    }

    let text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content.trim() : "";
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      message: "Code generated successfully by OpenRouter AI!",
      htmlCode: parsed.htmlCode || currentHtml || "",
      cssCode: parsed.cssCode || currentCss || "",
      jsCode: parsed.jsCode || currentJs || ""
    });
  } catch (err) {
    console.error("OpenRouter AI Error:", err);
    return res.json({
      success: false,
      message: "AI Generation error: " + (err.message || "Unknown error")
    });
  }
});

router.post("/fixCode", async (req, res) => {
  let { htmlCode, cssCode, jsCode, error, projectTitle } = req.body;
  if (!error) {
    return res.json({ success: false, message: "Error message is required" });
  }

  let apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    return res.json({
      success: false,
      message: "Please add your OPENROUTER_API_KEY to backend/.env file to use AI Fix!"
    });
  }

  let model = process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://codeignite.dev",
        "X-Title": "CodeIgnite Web IDE",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an expert full-stack web developer and debugging assistant for CodeIgnite IDE.
The user is building a project titled "${projectTitle || "Web App"}".
The current application code is producing a runtime error. Fix the bug while preserving the overall design, topic, and existing functionality.
Return ONLY a valid raw JSON object (with NO markdown backticks) containing:
{
  "htmlCode": "fixed HTML code",
  "cssCode": "fixed CSS code",
  "jsCode": "fixed JS code"
}`
          },
          {
            role: "user",
            content: `Runtime Error: "${error}"

Current HTML:
${htmlCode}

Current CSS:
${cssCode}

Current JS:
${jsCode}

Fix this code and return corrected JSON.`
          }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.json({
        success: false,
        message: "OpenRouter API error: " + (data.error.message || JSON.stringify(data.error))
      });
    }

    let text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content.trim() : "";
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      message: "Code fixed successfully by AI!",
      htmlCode: parsed.htmlCode || htmlCode,
      cssCode: parsed.cssCode || cssCode,
      jsCode: parsed.jsCode || jsCode
    });
  } catch (err) {
    console.error("OpenRouter AI Fix Error:", err);
    return res.json({
      success: false,
      message: "AI Fix error: " + (err.message || "Unknown error")
    });
  }
});

module.exports = router;
