export function HeroTitle({ locale }: { locale: string }) {
  const zh = locale === 'zh-hk'
  return <div className="relative max-w-2xl text-left">
    <p className="inline-flex rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-sm font-bold text-yellow-200">
      {zh ? '香港月租勞工住宿' : 'Hong Kong monthly worker accommodation'}
    </p>
    <h1 className="mt-6 text-4xl font-black leading-[1.12] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
      {zh ? <>港九各區 <span className="text-yellow-300">勞工宿舍、外勞宿舍</span></> : <>Monthly worker accommodation, <span className="text-yellow-300">matched to your Hong Kong stay</span></>}
    </h1>
    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
      {zh
        ? '按地區、住宿性別和入住日期搜尋。僱主安排多人住宿，也可以先整理條件再查詢。'
        : 'Search by district, gender and move-in date. Employers can also shortlist options for group accommodation.'}
    </p>
    <ul className="mt-7 flex flex-wrap gap-2 text-sm font-semibold text-slate-100" aria-label={zh ? '服務特點' : 'Service features'}>
      <li className="home-hero-chip">{zh ? '月租床位' : 'Monthly beds'}</li>
      <li className="home-hero-chip">{zh ? '多區選擇' : 'Multiple districts'}</li>
      <li className="home-hero-chip">{zh ? '入住前確認' : 'Confirm before move-in'}</li>
    </ul>
  </div>
}
