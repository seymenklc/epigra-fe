"use client"
import { useAuthContext } from "@/context/auth-context"
import { PageRoutes } from "@/utils/enums"
import { redirect } from "next/navigation"

export default function AuthLayout(props: React.PropsWithChildren): JSX.Element {
	const { user } = useAuthContext()

	if (user) {
		redirect(PageRoutes.Home)
	}

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="border border-stone-200 rounded sm:mx-auto sm:w-full sm:max-w-[480px]">
				{props.children}
			</div>
		</div>
	)
}
