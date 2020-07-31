import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MessagesService from '../../services/MessagesService'
import Header from '../../components/Header'
import Formaters from '../../common/formaters'
import Auth from '../../common/auth'
import UsersService from '../../services/UsersService'
const io = require('socket.io-client')

interface Message {
	_id: string
	from: {
		_id: string
		username: string
	}
	to?: {
		_id: string
		username: string
	}
	content: string
	createdAt: string
}

interface ChatRouteParams {
	id?: string
}

const Chat: React.FC = () => {
	const [ messages, setMessages ] = useState<Message[]>([])
	const [ message, setMessage ] = useState("")
	const [ socket, setSocket ] = useState(io('http://localhost:3333'))
	const [ receiver, setReceiver ] = useState("")
	const [ receiverName, setReceiverName ] = useState("")
	const [ messagesService ] = useState(new MessagesService(socket))
	const usersService = new UsersService()
	const auth = new Auth()
	const params = useParams() as ChatRouteParams

	useEffect(() => {
		socket.disconnect()
		const connection = io('http://localhost:3333')
		const { id } = params

		connection.on("loadOldMessages", () => {
			if (id) {
				messagesService.show(id)
					.then(res => setMessages(res.data.messages))
					.catch(() => alert("Falha ao carregar mensagens antigas, tente novamente."))
			}
			else {
				messagesService.getAll()
					.then(res => setMessages(res.data.messages))
					.catch(() => alert("Falha ao carregar mensagens antigas, tente novamente."))
			}
		})
	
		connection.on("loadNewMessage", (newMessage: Message) => {
			if (newMessage.to === undefined && !params.id) {
				setMessages(messages => [newMessage, ...messages])
			}
			else if (newMessage.to !== undefined && newMessage.from._id === params.id) {
				setMessages(messages => [newMessage, ...messages])
			}

			if ("Notification" in window) {
				if (Notification.permission === "granted") {
					new Notification("Realtime Chat", {
						body: `Nova mensagem de ${newMessage.from.username}`
					})
				}
				else if (Notification.permission !== 'denied') {
					Notification.requestPermission(function (permission) {
					  if (permission === "granted") {
						new Notification("Realtime Chat", {
							body: `Nova mensagem de ${newMessage.from.username}`
						})
					  }
					})
				}
			}
		})

		if (params.id) setReceiver(params.id)
		setSocket(connection)
	}, [])

	useEffect(() => {
		const { username } = auth.getTokenData()
		socket.emit('setUsername', username)
	}, [socket])

	useEffect(() => {
		usersService.show(receiver)
			.then(response => setReceiverName(response.data.user.username))
			.catch(() => setReceiverName("Desconhecido"))
	}, [receiver])

	function handleSendMessage(evt: React.MouseEvent) {
		evt.preventDefault()
		if (!message.length) return
		const { id, username } = auth.getTokenData()

		const data = {
			from: {
				_id: id,
				username
			},
			content: message,
			to: receiver
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
				<Header socket={socket} conversation={receiver ? receiverName : "Chat Público"}/>
				<section className="h-100 p-2 d-flex flex-column-reverse messages-panel">
					{	
						messages.map(message => (
							<article key={message._id} className={`message-box px-3 py-2 mt-2 ${message.from.username === auth.getTokenData().username ? "align-self-end" : ""}`}>
								<h5 className="card-title mb-1">{message.from.username}</h5>
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