import React, { useState, MouseEvent } from 'react'
import { MdAccountCircle, MdExitToApp } from 'react-icons/md'
import socket from '../../common/socket'
import MessagesService from '../../services/MessagesService'
import Formaters from '../../common/formaters'
import './Chat.css'

interface Message {
	_id: string
	username: string
	content: string
	createdAt: string
}

const Chat: React.FC = () => {
	const [ messages, setMessages ] = useState<Message[]>([])
	const [ message, setMessage ] = useState("")

	socket.on("loadOldMessages", () => {
		MessagesService.getAll()
			.then(res => setMessages(res.data.messages))
			.catch(err => console.log(err))
	})

	socket.on("loadNewMessage", (message: Message) => {
		setMessages([ ...messages, message])
	})

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
		MessagesService.create(data)
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
				<header className="navbar d-flex justify-content-between bg-lightblue">
					<h2 className="navbar-brand mb-0 text-light text-500">Realtime Chat</h2>
					<div>
						<button className="btn btn-link hover-opacity text-light">
							<MdAccountCircle className="icon" title="Usuário"/>
						</button>
						<button className="btn btn-link hover-opacity text-light">
							<MdExitToApp className="icon" title="Sair"/>
						</button>
					</div>
				</header>
				<section className="h-100 p-2 d-flex flex-column justify-content-end messages-panel">
					{	
						messages.map(message => (
							<article key={message._id} className="message-box px-3 py-2 mt-2">
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
						<button className="btn btn-lightblue send-button text-500" onClick={handleSendMessage}>Enviar</button>
					</form>
				</footer>
			</main>
		</div>
	)
}

export default Chat