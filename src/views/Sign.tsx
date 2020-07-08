import * as React from 'react'
import ArrowRight from '../assets/ArrowRight'

export interface Props {}

export interface State {
	username: string
	error: boolean | null
}

export default class Sign extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			username: "",
			error: null
		}
	}

	render() {
		const { error } = this.state

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
									onChange={evt => this.handleChangeUsername(evt.target.value)}/>
							</div>
							<button 
								className="btn btn-lg btn-brown text-500 d-flex align-items-center"
								disabled={error || error === null ? true : false}
								onClick={evt => this.handleEnter(evt)}>
								Começar
								<ArrowRight />
							</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

	handleChangeUsername = (username: string) => {
		let error;
		!username.length ? error = true : error = false
		this.setState({ username, error })
	}

	handleEnter = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		evt.preventDefault()
		localStorage.setItem("username", this.state.username)
		window.location.replace("/chat")
	}
}