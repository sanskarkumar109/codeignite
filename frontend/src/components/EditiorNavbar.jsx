import React from 'react'
import logo from "../images/logo.png"
import { FiDownload } from "react-icons/fi";
import { FaRegFileCode } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ListCard from './ListCard';



const EditiorNavbar = () => {
  return (
    <>
     <div className="EditorNavbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/">
            <img className="w-[60px] cursor-pointer" src={logo} alt="Logo" />
          </Link>
        </div>
        <p>File / <span className='text-[gray]'>Project</span></p>
        <i className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FaFileCode /></i>
      </div>
    </>
  )
}

export default EditiorNavbar