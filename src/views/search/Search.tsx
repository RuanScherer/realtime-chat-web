import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import UsersService from '../../services/UsersService'
import Auth from '../../common/auth'

interface User {
	_id: string
	username: string
}

const Chat: React.FC = () => {
	const [ users, setUsers ] = useState<User[]>([])
	const [ usersService ] = useState(new UsersService())
	const auth = new Auth()

	useEffect(() => {
		const { username } = auth.getTokenData()
	}, [])

	function handleSearch(search: string) {
		if (!search.length) return

		usersService.search(search)
			.then(response => {
				setUsers(response.data.users)
			})
			.catch(() => alert("Erro ao buscar usuários."))
	}

	return (
		<div className="app-container">
			<main className="h-100 d-flex flex-column justify-content-between">
				<section className="w-100 search-bar border-0">
					<form className="search-form p-2">
						<div className="form-group pr-2">
							<input 
								type="text"
								id="user"
								name="user"
								className="form-control"
								placeholder="Busque por algum usuário"
								autoComplete="off"
								onChange={evt => handleSearch(evt.target.value)}/>
						</div>
					</form>
				</section>
				<section className="h-100 p-2 d-flex flex-column align-items-center search-panel">
					<span className="text-muted mb-2">
						{ users.length >= 1 ? "Selecione um usuário para abrir o chat" : "Nenhum resultado encontrado, continue buscando" }
					</span>
					{	
						users.map(user => {
							if (!(user.username === auth.getTokenData().username)) {
								return(
									<article key={user._id} className="w-100 search-box px-3 py-2 my-1 card-title h5">
										{user.username}
									</article>
								)
							}
						})
					}
				</section>
			</main>
		</div>
	)
}

export default Chat