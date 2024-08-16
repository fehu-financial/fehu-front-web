type MainProps = {
	children: React.ReactNode;
};

export function Main({ children }: MainProps) {
	return (
		<main className="col-start-2 row-start-2 flex flex-col flex-1 h-full mx-10 py-6 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-auto no-scrollbar">
			{children}
		</main>
	);
}
