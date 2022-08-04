import React, { useState } from "react"

export interface ICompTag {
    text: string
    color?: string
}

export const CompTag = (props: ICompTag) => {

    return (
        <div style={{
            background: props.color || "gray",
            color: "white",
            borderRadius: 3,
            borderWidth: "1px",
            width: 44,
            height: 20,
            padding: "1px 2px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: Math.floor(26 - 4 * props.text.length)
        }}>
            {props.text}
        </div>
    )
}