import React from "react";
import {modifyStyle} from "../utils";


const main = () => {
  const eleTitle = document.querySelector('title')

  modifyStyle(eleTitle, {
    background: 'cyan',
    position: 'fixed',
    zIndex: '999',
    top: '56px'
  })
}

main()
