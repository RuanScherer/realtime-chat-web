import React, { useState } from 'react'
import UsersService from '../../services/UsersService'
import  { useHistory } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'
import './Sign.css'

const Sign: React.FC = () => {
	const [ username, setUsername ] = useState("")
	const [ password, setPassword ] = useState("")
	const [ registered, setRegistered ] = useState(false)
	const [ error, setError ] = useState(false)
	const history = useHistory()
	const usersService = new UsersService()

	function changeForm(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		evt.preventDefault()
		setUsername("")
		setPassword("")
		setRegistered(!registered)
	}

	function handleEnter(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		evt.preventDefault()
		let data = {
			username,
			password
		}
		let promise = registered ? usersService.login(data) : usersService.register(data)
		promise
			.then(response => {
				localStorage.setItem("accessToken", response.data.token)
				history.replace("/chat")
			})
			.catch(err => {
				setError(true)
			})
		localStorage.setItem("username", username)
	}

	return (
		<div className="min-100vh px-3 pb-0">
			<div className="card mx-auto main-card w-100 shadow-sm">
				<div className="card-body d-flex flex-column">
					<h2 className="mb-4 align-self-center">Realtime Chat</h2>
					<h5 className="mb-3 align-self-center">{ registered ? "Entrar com conta existente" : "Cadastre-se para começar"}</h5>
					<form className="d-flex flex-column">
						<div className="form-group">
							<label htmlFor="username" className="text-500">Nome de usuário</label>
							<input 
								type="text"
								id="username"
								name="username"
								className="form-control form-control-lg"
								placeholder="Seu nome de usuário"
								aria-describedby="usernameHelp"
								onChange={evt => setUsername(evt.target.value)}/>
							{ !registered &&
								<small id="usernameHelp" className="form-text text-muted">
									As pessoas irão te encontrar por esse identificador.
								</small>
							}
						</div>
						<div className={`form-group ${error ? "mb-0" : ""}`}>
							<label htmlFor="password" className="text-500">Senha</label>
							<input 
								type="password"
								id="password"
								name="password"
								className="form-control form-control-lg"
								placeholder="Sua senha secreta"
								onChange={evt => setPassword(evt.target.value)}/>
						</div>
						{ error &&
							<span className="text-danger font-weight-bold m-2">
								{ registered ? "Erro ao logar-se, tente novamente." : "Erro ao cadastrar-se, tente novamente." }
							</span>
						}
						<button 
							className="btn btn-lg btn-block btn-secondary text-500 d-flex align-items-center"
							onClick={evt => handleEnter(evt)}>
							{ registered ? "Entrar" : "Começar"}
							<MdArrowForward className="ml-auto"/>
						</button>
						<button className="btn btn-link text-muted align-self-center" onClick={(evt) => changeForm(evt)}>Já possui uma conta? Entre</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Sign