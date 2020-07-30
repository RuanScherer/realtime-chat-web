import React from 'react'
import { Link } from 'react-router-dom'
import { MdAccountCircle, MdExitToApp, MdSearch, MdHome } from 'react-icons/md'
import Auth, { Socket } from '../common/auth'

export interface Props {
	socket?: Socket,
	conversation?: string
}

const Header: React.FC<Props> = ({ socket, conversation }) => {
	const auth = new Auth()

	return (
		<header className="navbar d-flex justify-content-between bg-secondary">
			<h2 className="navbar-brand mb-0 text-light text-500">
				{ conversation || 'Realtime Chat' }
			</h2>
			<div>
				<Link to="/" className="btn btn-link hover-opacity text-light">
					<MdHome className="icon" title="Início"/>
				</Link>
				<Link to="/search" className="btn btn-link hover-opacity text-light">
					<MdSearch className="icon" title="Buscar usuários"/>
				</Link>
				<Link to="/account" className="btn btn-link hover-opacity text-light">
					<MdAccountCircle className="icon" title="Minha conta"/>
				</Link>
				<button className="btn btn-link hover-opacity text-light">
					<MdExitToApp className="icon" title="Sair" onClick={() => socket ? auth.logout(socket) : auth.logout()}/>
				</button>
			</div>
		</header>
	)
}

export default Header