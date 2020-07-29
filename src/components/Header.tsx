import React from 'react'
import { Link } from 'react-router-dom'
import { MdAccountCircle, MdExitToApp, MdSearch } from 'react-icons/md'
import Auth, { Socket } from '../common/auth'

export interface Props {
	socket: Socket
}

const Header: React.FC<Props> = ({ socket }) => {
	const auth = new Auth()

	return (
		<header className="navbar d-flex justify-content-between bg-secondary">
			<h2 className="navbar-brand mb-0 text-light text-500">Realtime Chat</h2>
			<div>
				<Link to="search" className="btn btn-link hover-opacity text-light">
					<MdSearch className="icon" title="Buscar usuários"/>
				</Link>
				<button className="btn btn-link hover-opacity text-light">
					<MdAccountCircle className="icon" title="Minha conta"/>
				</button>
				<button className="btn btn-link hover-opacity text-light">
					<MdExitToApp className="icon" title="Sair" onClick={() => auth.logout(socket)}/>
				</button>
			</div>
		</header>
	)
}

export default Header