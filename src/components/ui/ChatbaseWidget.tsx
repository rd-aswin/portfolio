/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    chatbase?: any;
    chatbaseUserConfig?: any;
  }
}

export default function ChatbaseWidget() {
  useEffect(() => {
    // 1. Initialize chatbase object
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    // 2. Dynamic Loader script creation
    const onLoad = function () {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "c1oTm388e7Bv8k3SSKoTN";
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    // 3. Optional Admin Identification if authenticated
    const identifyAdmin = async () => {
      const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";
      const password = sessionStorage.getItem("admin_password");

      if (isAuthenticated && password) {
        try {
          const res = await fetch("/api/admin/chatbase-token", {
            headers: {
              "Authorization": `Bearer ${password}`,
            },
          });
          if (res.ok) {
            const { token } = await res.json();
            window.chatbase("identify", {
              token,
              name: "R D Aswin (Admin)"
            });
            console.log("[Chatbase] Admin identified successfully");
          }
        } catch (err) {
          console.error("[Chatbase] Failed to fetch identity token:", err);
        }
      }
    };

    // Run identity verification after script mounts
    setTimeout(identifyAdmin, 1500);
  }, []);

  return null;
}
