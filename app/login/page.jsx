"use client"

import { useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
export default function Login() {
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    const loginTest = await axios.post("/login-action", { username: e.target.username.value, password: e.target.password.value })

    console.log(loginTest.data.message)

    if (loginTest.data.message == "Success") {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="page-section">
      <div className="page-section-inner">
        <a href="/" className="small-link">
          &laquo; Retour à l'accueil
        </a>

        <h1 className="page-section-title mb-big">Vous devez d'abord vous connecter.</h1>
        <form onSubmit={handleSubmit}>
          <input autoFocus autoComplete="off" className="form-field" type="text" name="username" placeholder="Pseudo" />
          <input className="form-field" name="password" type="password" placeholder="Mot de passe" />
          <button className="our-btn">Connexion</button>
        </form>
      </div>
    </div>
  )
}
