"use client";

import { useState } from "react";
import styles from "./custom-checkbox.module.css";

export default function CustomCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: "absolute", width: 0, height: 0 }}
            >
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div className="relative w-4 h-4 top-1">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className={`${styles.cbxInput} absolute w-4.5 h-4.5 rounded-full z-10`}
                />

                <label
                    className={`${styles.cbxLabel} absolute w-4.5 h-4.5 rounded-full flex items-center justify-center pointer-events-none`}
                >
                    <svg
                        width="10"
                        height="9"
                        viewBox="0 0 16 14"
                        shapeRendering="geometricPrecision"
                    >
                        <path
                            d="M2 8.36364L6.23077 12L13 2"
                            fill="none"
                            stroke="#2c333a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                            strokeDasharray="20"
                            strokeDashoffset="20"
                            style={{ transition: "stroke-dashoffset 0.4s ease" }}
                        />
                    </svg>
                </label>
            </div>
        </>
    );
}