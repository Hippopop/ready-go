import { notFound } from 'next/navigation'
import { getResumeData } from '@/lib/actions/resume'
import ExecutiveTemplate from '@/components/resume/templates/executive'
import MinimalTemplate from '@/components/resume/templates/minimal'
import CreativeTemplate from '@/components/resume/templates/creative'

export default async function ResumeRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ uid: string }>
  searchParams: Promise<{ template?: string }>
}) {
  const { uid } = await params
  const { template: templateParam } = await searchParams
  
  const data = await getResumeData(uid)
  if (!data || !data.profile) notFound()

  const template = templateParam ?? 'executive'

  return (
    <>
      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } body { background: white; }`}</style>
      {template === 'executive' && <ExecutiveTemplate data={data} />}
      {template === 'minimal'   && <MinimalTemplate   data={data} />}
      {template === 'creative'  && <CreativeTemplate  data={data} />}
    </>
  )
}

