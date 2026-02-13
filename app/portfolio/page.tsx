import { redirect } from 'next/navigation'

export default function PortfolioRedirect() {
  // permanent redirect so old URLs continue to work / preserve SEO
  redirect('/projects')
}
