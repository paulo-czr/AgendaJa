import React from 'react';
import { createRoot } from 'react-dom/client';
import { Aplicativo } from './app/Aplicativo';
import './app/estilos.css';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
	throw new Error('Elemento raiz da aplicação não encontrado.');
}

createRoot(elementoRaiz).render(
	<React.StrictMode>
		<Aplicativo />
	</React.StrictMode>,
);