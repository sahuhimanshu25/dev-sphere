import React from 'react'
import { Console, Header, TextArea } from './InputConsole'
import { BiExport } from 'react-icons/bi'

const OutputConsole = ({ currentOutput }) => {
  return (
    <Console style={{height:"99%",backgroundColor:"transparent"}}>
      <Header style={{backgroundColor: "transparent",border: "",background: "rgba(255, 255, 255, 0.1)",backdropFilter: "blur(10px)",WebkitBackdropFilter: "blur(10px)",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",color:"whitesmoke"}}>
        Output:

        <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentOutput)}`} download="output.txt">
          <BiExport style={{color:"whitesmoke",fontSize:"20px"}}/> <span style={{color:"whitesmoke",fontSize:"20px"}}>Export Output</span>
        </a>

      </Header>
      <TextArea
        value={currentOutput}
        disabled
        style={{
          backgroundColor: "transparent",
          border: "1px solid #7C78EB",
          background: "transparent",
          boxShadow: "0 4px 12px rgba(166, 154, 255, 0.3)"
        }}
      />
    </Console>
  )
}

export default OutputConsole