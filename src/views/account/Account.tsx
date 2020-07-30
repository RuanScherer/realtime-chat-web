import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import UsersService from '../../services/UsersService'
import Auth from '../../common/auth'

const Account: React.FC = () => {
    const [username, setUsername] = useState("")
    const [status, setStatus] = useState("")
    const usersService = new UsersService()
    const auth = new Auth()

    useEffect(() => {
        usersService.show(auth.getTokenData().id)
            .then(response => setUsername(response.data.user.username))
            .catch(() => alert('Erro ao carregar seus dados.'))
    }, [])

    function handleSave(evt: React.MouseEvent) {
        evt.preventDefault()
        usersService.update(auth.getTokenData().id, username)
            .then(() => {
                setStatus("success")
                setTimeout(() => {
                    auth.logout()
                }, 3000)
            })
            .catch(() => setStatus("error"))
    }

    return (
        <div className="app-container">
			<main className="h-100 d-flex flex-column justify-content-between">
				<Header />
				<section className="h-100 p-2 d-flex flex-column justify-content-center align-items-center search-panel">
                    <h4>Alterar nome de usuário</h4>
                    <form className="mt-2">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text"
                                id="username"
                                name="username"
                                className="form-control form-control-lg"
                                placeholder="Seu nome de usuário"
                                aria-describedby="usernameHelp"
                                value={username}
                                onChange={evt => setUsername(evt.target.value)}/>
                            <small id="usernameHelp" className="form-text text-muted">
                                As pessoas irão te encontrar por esse identificador.
                            </small>
                        </div>
                        { status !== "" &&
                            <div className={`alert alert-${status === 'success' ? status : 'danger'}`} role="dialog">
                                { status === 'success' ? 'Sucesso! Você será deslogado para aplicar as alterações.' : 'Erro ao salvar alterações.' }
                            </div>
                        }
                        <button 
							className="btn btn-lg btn-block btn-secondary text-500"
                            onClick={handleSave}>
							Salvar
						</button>
                    </form>
				</section>
			</main>
		</div>
    )
}

export default Account