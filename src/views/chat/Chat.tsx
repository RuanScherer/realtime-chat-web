import React, { useState, useEffect } from 'react'
import { MdAccountCircle, MdExitToApp } from 'react-icons/md'
import MessagesService from '../../services/MessagesService'
import Formaters from '../../common/formaters'
import './Chat.css'
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
				.catch(err => alert("Falha ao carregar mensagens antigas, tente novamente."))
		})
	
		connection.on("loadNewMessage", (message: Message) => {
			setMessages([ ...messages, message])
		})

		setSocket(connection)
	}, [])

	function handleChangeMessage(evt: React.ChangeEvent<HTMLInputElement>) {
		setMessage(evt.target.value)
	}

	function handleSendMessage(evt: React.MouseEvent) {
		evt.preventDefault()
		if (!message.length) return

		const data = {
			username: localStorage.getItem('username') as string,
			content: message
		}
		messagesService.create(data)
			.then(response => {
				const { message } = response.data
				setMessage("")
				setMessages([ ...messages, message])
				socket.emit('newMessage', message)
			})
			.catch(() => alert("Erro ao enviar mensagem."))
	}

	return (
		<div className="app-container">
			<main className="h-100 d-flex flex-column justify-content-between">
				<header className="navbar d-flex justify-content-between bg-secondary">
					<h2 className="navbar-brand mb-0 text-light text-500">Realtime Chat</h2>
					<div>
						<button className="btn btn-link hover-opacity text-light">
							<MdAccountCircle className="icon" title="Usuário"/>
						</button>
						<button className="btn btn-link hover-opacity text-light">
							<MdExitToApp className="icon" title="Sair" onClick={() => auth.logout(socket)}/>
						</button>
					</div>
				</header>
				<section className="h-100 p-2 d-flex flex-column justify-content-end messages-panel">
					{	
						messages.map(message => (
							<article key={message._id} className={`message-box px-3 py-2 mt-2 ${message.username === localStorage.getItem('username') ? "align-self-end" : ""}`}>
								<h5 className="card-title mb-1">
									{message.username}
									<span className="text-muted font-weight-normal"> às {Formaters.formatTime(message.createdAt)}</span>
								</h5>
								<p className="h6 font-weight-normal mb-0">{message.content}</p>
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
								onChange={handleChangeMessage}/>
						</div>
						<button className="btn btn-secondary send-button text-500" onClick={handleSendMessage}>Enviar</button>
					</form>
				</footer>
			</main>
		</div>
	)
}

export default Chat