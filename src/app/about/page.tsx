import Bibliography from '@/components/About/Bibliography/Bibliography'
import EmergedNiceia from '@/components/About/EmergedNiceia/EmergedNiceia'
import Header from '@/components/About/Header/Header'
import Others from '@/components/About/Institutions/Others/Others'
import Promoters from '@/components/About/Institutions/Promoters/Promoters'
import Sponsors from '@/components/About/Institutions/Sponsors/Sponsors'
import Organization from '@/components/About/Organization/Organization'
import PlannedActivities from '@/components/About/PlannedActivities/PlannedActivities'
import Questions from '@/components/About/Questions/QuestionsContent'
import ScientificSecretary from '@/components/About/ScientificSecretary/ScientificSecretary'
import Team from '@/components/About/Team/Team'
import VeritasInCaritate from '@/components/About/VeritasInCaritate/VeritasInCaritate'
import PlatformIllustration from '@/components/About/PlatformIllustration/PlatformIllustration'
import React from 'react'

const page = () => {
  return (
    <>
      <Header />
      <EmergedNiceia />
      <Promoters />
      <Sponsors />
      <Others />
      <PlannedActivities />
      <Bibliography />
      <VeritasInCaritate />
      <PlatformIllustration />
      <Organization />
      <ScientificSecretary />
      <Team />
      <Questions />
    </>
  )
}

export default page