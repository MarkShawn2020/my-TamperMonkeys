import React from "react";
import {modifyStyle} from "../utils";


const fixQuestion = () => {
  const eleContainer = document.querySelector('.inner-content')
  const eleQ1 = eleContainer.children[0] as HTMLElement
  const eleQ2 = eleContainer.children[1] as HTMLElement
  const eleOthers = eleContainer.children[2] as HTMLElement


  modifyStyle(eleQ1, {
    background: 'cyan',
    position: 'fixed',
    zIndex: '999',
    top: '56px'
  })

  modifyStyle(eleQ2, {
    background: 'magenta',
    position: 'fixed',
    zIndex: '999',
    top: '100px'
  })

  eleOthers.style.marginTop = '120px'

}

fixQuestion()
