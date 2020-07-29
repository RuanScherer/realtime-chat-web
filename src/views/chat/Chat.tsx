import React, { useState, useEffect } from 'react'
import MessagesService from '../../services/MessagesService'
import Header from '../../components/Header'
import Formaters from '../../common/formaters'
import Auth from '../../common/auth'
const io = require('socket.io-client')

interface Message {
	_id: string
	username: string
	to?: string
	content: string
	createdAt: string
}

const Chat: React.FC = () => {
	const [ messages, setMessages ] = useState<Message[]>([])
	const [ message, setMessage ] = useState("")
	const [ socket, setSocket ] = useState(io('http://localhost:3333'))
	const [ messagesService ] = useState(new MessagesService(socket))
	const auth = new Auth()

	useEffect(() => {
		socket.disconnect()
		const connection = io('http://localhost:3333')

		const { username } = auth.getTokenData()
		connection.emit('setUsername', username)

		connection.on("loadOldMessages", () => {
			messagesService.getAll()
				.then(res => setMessages(res.data.messages))
				.catch(() => alert("Falha ao carregar mensagens antigas, tente novamente."))
		})
	
		connection.on("loadNewMessage", (newMessage: Message) => setMessages(messages => [newMessage, ...messages]))

		setSocket(connection)
	}, [])

	function handleSendMessage(evt: React.MouseEvent) {
		evt.preventDefault()
		if (!message.length) return
		const { username } = auth.getTokenData()

		const data = {
			username,
			content: message
		}
		messagesService.create(data)
			.then(response => {
				setMessage("")
				setMessages(messages => [response.data.message, ...messages])
				socket.emit('newMessage', response.data.message)
			})
			.catch(() => alert("Erro ao enviar mensagem."))
	}

	return (
		<div className="app-container">
			<main className="h-100 d-flex flex-column justify-content-between">
				<Header socket={socket} />
				<section className="h-100 p-2 d-flex flex-column-reverse messages-panel">
					{	
						messages.map(message => (
							<article key={message._id} className={`message-box px-3 py-2 mt-2 ${message.username === auth.getTokenData().username ? "align-self-end" : ""}`}>
								<h5 className="card-title mb-1">{message.username}</h5>
								<p className="h6 font-weight-normal mb-0">{message.content}</p>
								<small className="text-muted">{Formaters.formatTime(message.createdAt)} (UTC)</small>
							</article>
						))
					}
				</section>
				<footer className="w-100 message-bar">
					<form className="message-form p-2">
						<div className="form-group pr-2">
							<input 
								type="text"
								id="message"
								name="message"
								className="form-control"
								placeholder="Digite sua mensagem"
								autoComplete="off"
								value={message}
								onChange={evt => setMessage(evt.target.value)}/>
						</div>
						<button className="btn btn-secondary send-button text-500" onClick={handleSendMessage}>Enviar</button>
					</form>
				</footer>
			</main>
		</div>
	)
}

export default Chat