"use client"

import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
import Chat from "./chat";

export default function Footer(props) {
  function AdminFooterOrNot() {
    if (props.isAdmin) {
      return (
          <>
            <Chat />
            <p className="logout-text">
              <a href="" onClick={handleClick}>
                Déconnexion
              </a>
            </p>
          </>
      )
    } else {
      return <></>
    }
  }

  const router = useRouter()

  async function handleClick(e) {
    e.preventDefault()
    await axios.get("/logout-action")
    router.replace("/login")
    router.refresh()
  }

  return (
    <>
      <footer className="site-footer">
        {AdminFooterOrNot()}
        <p className="footer-nav">
          <Link href="/">Accueil</Link>
          <Link href="/our-history">Notre Histoire</Link>
          <Link href="/our-vision">Notre Vision</Link>
        </p>
        <p>&copy; 2024 Faux centre d'adoption. Tous droits réservés.</p>
      </footer>
    </>
  )
}
