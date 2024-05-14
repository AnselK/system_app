import React, { memo, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const ProtectRoute:React.FC<React.PropsWithChildren> = ({children})=>{
    const location = useLocation()
    const previousLocationRef = useRef(location)
    useEffect(()=>{
        const from = previousLocationRef.current.pathname;
        const to = location.pathname;
        console.log(`Navigated from ${from} to ${to}`);
    },[location])
    return children
}

export default memo(ProtectRoute)