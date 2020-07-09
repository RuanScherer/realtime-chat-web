import React, { useState } from 'react'
import  { useHistory } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'

const Sign: React.FC = () => {
	const [ username, setUsername ] = useState("")
	const [ error, setError ] = useState<boolean | null>(null)
	const history = useHistory()

	const handleChangeUsername = (username: string) => {
		let error;
		!username.length ? error = true : error = false
		setUsername(username)
		setError(error)
	}

	const handleEnter = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		evt.preventDefault()
		localStorage.setItem("username", username)
		history.replace("/chat")
	}

	return(
		<div className="min-100vh p-2 d-flex flex-column justify-content-center align-items-center">
			<div className="card main-card w-100 radius shadow">
				<div className="card-body">
					<h2 className="mb-0">Realtime Chat</h2>
					<h5 className="text-muted mb-3">É necessário informar seu nome para continuar</h5>
					<form >
						<div className="form-group">
							<label htmlFor="name" className="text-500">Nome</label>
							<input 
								type="text"
								id="name"
								name="username"
								className={`form-control form-control-lg ${error ? "border-danger" : ""}`}
								placeholder="Seu nome aqui"
								onChange={evt => handleChangeUsername(evt.target.value)}/>
						</div>
						<button 
							className="btn btn-lg btn-brown text-500 d-flex align-items-center"
							disabled={error || error === null ? true : false}
							onClick={evt => handleEnter(evt)}>
							Começar
							<MdArrowForward className="ml-1"/>
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Sign