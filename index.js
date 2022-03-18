const express = require('express')
const nodemailer = require('nodemailer')
const {engine} = require('express-handlebars')
const { join } = require('path')

require('dotenv').config()

const app = express()

//env variable
const PASSWORD = process.env.PASSWORD

//view setup 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.locals.layout = false


app.use('/public', express.static(join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req, res)=> {
  res.render('contact')
})

app.post('/send', async (req,res)=> {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  
  `

  let transporter = nodemailer.createTransport({
    host: "mail.marinceomario.com ",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'test@marinceomario.com', // generated ethereal user
      pass: PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"niicode" test@marinceomario.com', // sender address
    to: 'niidarku66@gmail.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render('contact', {msg: "Email has been sent"})
})

app.listen(8000, ()=> console.log('App is running'))