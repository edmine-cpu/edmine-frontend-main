import { FilteredList } from '@/components/FilteredList/FilteredList'
import React from 'react'

export default function UniversalCompaniesPage({
	params,
	searchParams,
}: {
	params: Promise<{ segments?: string[] }>
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = React.use(params)
	const resolvedSearchParams = React.use(searchParams)
	const segments = resolvedParams?.segments || []

	return (
		<FilteredList
			type='companies'
			segments={segments}
			searchParams={resolvedSearchParams}
		/>
	)
}
