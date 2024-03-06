import { ObjectId } from "mongodb"
import clientPromise from "../../lib/mongodb"
import { NextResponse } from "next/server"
const sanitizeHtml = require("sanitize-html")
const nodemailer = require("nodemailer")

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {}
}

export async function POST(request) {
  const incoming = await request.json()

  console.log(incoming)
  // borrow code from express version etc...
  if (incoming.answer.toUpperCase() !== "CHIOT") {
    return NextResponse.json({ message: "Désolé" })
  }

  const ourObject = {
    name: sanitizeHtml(incoming.name, sanitizeOptions),
    email: sanitizeHtml(incoming.email, sanitizeOptions),
    comment: sanitizeHtml(incoming.comment, sanitizeOptions)
  }

  if (!ObjectId.isValid(incoming.petId)) {
    return NextResponse.json({ message: "ID invalide" })
  }

  ourObject.petId = new ObjectId(incoming.petId)
  const client = await clientPromise
  const doesPetExist = await client
    .db()
    .collection("pets")
    .findOne({ _id: new ObjectId(ourObject.petId) })

  if (doesPetExist) {
    await client.db().collection("contacts").insertOne(ourObject)

    // Configurer email via mailtrap avec NodeJS
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAPUSERNAME,
        pass: process.env.MAILTRAPPASSWORD
      }
    })

    // Envoyer email à l'utilisateur intéressé par l'animal
    transport.sendMail({
      to: ourObject.email,
      from: "admin@localhost",
      subject: `Merci de votre intérêt pour ${doesPetExist.name}`,
      html: `<h3 style="color: #475aff; font-size: 30px; font-weight: normal;">Merci beaucoup !</h3>
      <p>Nous apprécions votre intérêt pour ${doesPetExist.name} et un membre de l'équipe prendra contact avec vous rapidement. Vous trouverez ci-dessous une copie du message que vous nous avez envoyé pour vos dossiers personnels:</p>
      <p><em>${ourObject.comment}</em></p>`
    })

    // Envoyer un email à l'administrateur du site web
    transport.sendMail({
      to: "adoptioncenter@localhost",
      from: "admin@localhost",
      subject: `Quelqu'un est intéressé par ${doesPetExist.name}`,
      html: `<h3 style="color: #475aff; font-size: 30px; font-weight: normal;">Nouveau Contact !</h3>
       <p>
        Nom: ${ourObject.name} <br>
        Animal concerné: ${doesPetExist.name}<br>
        Email: ${ourObject.email}<br>
        Message: ${ourObject.comment}
      </p>`
    })

    console.log("email sent")

    return NextResponse.json({ message: "Success" })
  }

  res.json({ message: "No way" })

  // check for puppy as the answer etc...

  // build an object and sanitize it.

  // const client = await clientPromise
  // client.db().collection("pets").insertOne(ourObject)
  return NextResponse.json({ message: "No way" })
}
