import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface PropriedadesProvedor {
	children: ReactNode;
}

export function ProvedorAplicativo({ children }: PropriedadesProvedor) {
	const [clienteConsultas] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						staleTime: 30_000,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={clienteConsultas}>
			{children}
		</QueryClientProvider>
	);
}
