export default function AuthLayout(props: React.PropsWithChildren): JSX.Element {
	return (
		<div className="flex min-h-full flex-1 flex-col justify-center bg-gray-900 py-12 sm:px-6 lg:px-8">
			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
				{props.children}
			</div>
		</div>
	)
}
