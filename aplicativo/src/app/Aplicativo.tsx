import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProvedorNotificacoes } from '../lib/notificacoes';
import { ProvedorAplicativo } from './ProvedorAplicativo';
import { RotaProtegida } from '../modules/autenticacao/componentes/RotaProtegida';
import { PaginaCadastro } from '../modules/autenticacao/paginas/PaginaCadastro';
import { PaginaLogin } from '../modules/autenticacao/paginas/PaginaLogin';
import { PaginaRecuperarSenha } from '../modules/autenticacao/paginas/PaginaRecuperarSenha';
import { PaginaVerificarEmail } from '../modules/autenticacao/paginas/PaginaVerificarEmail';
import { PaginaHomeCliente } from '../modules/home-cliente/paginas/PaginaHomeCliente';
import { PaginaHomeEmpresa } from '../modules/home-empresa/paginas/PaginaHomeEmpresa';
import { ExigirOrganizacao } from '../modules/organizacoes/componentes/ExigirOrganizacao';
import { PaginaConfiguracoes } from '../modules/organizacoes/paginas/PaginaConfiguracoes';
import { PaginaServicos } from '../modules/servicos/paginas/PaginaServicos';
import { PaginaVitrinePublica } from '../modules/vitrine/paginas/PaginaVitrinePublica';
import { PaginaNaoEncontrada } from './PaginaNaoEncontrada';

function RotasAplicativo() {
	return (
		<Routes>
			<Route path="/entrar" element={<PaginaLogin />} />
			<Route path="/cadastro" element={<PaginaCadastro />} />
			<Route path="/verificar-email" element={<PaginaVerificarEmail />} />
			<Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />
			<Route path="/" element={<PaginaHomeCliente />} />
			<Route path="/painel" element={<Navigate to="/empresa" replace />} />
			<Route
				path="/empresa"
				element={
					<RotaProtegida papeis={['prestador']}>
						<ExigirOrganizacao>
							<PaginaHomeEmpresa />
						</ExigirOrganizacao>
					</RotaProtegida>
				}
			/>
			<Route
				path="/configuracoes"
				element={
					<RotaProtegida papeis={['prestador']}>
						<PaginaConfiguracoes />
					</RotaProtegida>
				}
			/>
			<Route
				path="/servicos"
				element={
					<RotaProtegida papeis={['prestador']}>
						<ExigirOrganizacao>
							<PaginaServicos />
						</ExigirOrganizacao>
					</RotaProtegida>
				}
			/>
			<Route path="/vitrine/:idOrganizacao" element={<PaginaVitrinePublica />} />
			<Route path="/404" element={<PaginaNaoEncontrada />} />
			<Route path="*" element={<PaginaNaoEncontrada />} />
		</Routes>
	);
}

export function Aplicativo() {
	return (
		<ProvedorAplicativo>
			<BrowserRouter>
				<RotasAplicativo />
				<ProvedorNotificacoes />
			</BrowserRouter>
		</ProvedorAplicativo>
	);
}
