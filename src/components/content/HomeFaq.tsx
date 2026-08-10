'use client'

import { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

const faqContent: Record<'zh-hk' | 'en', FaqItem[]> = {
  'zh-hk': [
    {
      question: '香港月租外勞宿舍適合哪些人？',
      answer: '月租外勞宿舍主要供需要在香港工作一段時間的人士使用，也適合僱主為新來港或輪班員工安排住宿。每個房源的入住對象和規則不同，查詢時請說明人數、性別及預計入住日期。',
    },
    {
      question: '目前有哪些地區可以選擇？',
      answer: '網站會列出目前可供查詢的地區，例如旺角、佐敦、荃灣或北角。實際選擇會隨床位狀況變動，可先用首頁的地區篩選查看，再確認地址和交通安排。',
    },
    {
      question: '外勞宿舍月租多少？',
      answer: '部分推廣床位由每月 HK$2,800 起，實際租金要看地區、房型、床位數量和入住日期。房源頁所列價格只作查詢參考，確認安排前會再核對。',
    },
    {
      question: '入住要付按金或其他費用嗎？',
      answer: '不同房源的按金、管理費及其他費用可能不同。提交查詢前不需要付款；確定房源時，請先索取租金、按金和其他費用的完整明細。',
    },
    {
      question: '男士和女士會分開住宿嗎？',
      answer: '大部分住宿會按房源指定性別安排。首頁可用性別條件篩選，但仍要在入住前確認房間分配。團體同住或特殊安排請在查詢時提出。',
    },
    {
      question: '最短可以住多久？',
      answer: '最短租期由個別房源決定，常見做法是按月安排。房源資料會列出已知的最短租期；如工作期較短或入住日不完整，可先提交日期再查詢。',
    },
    {
      question: '最快何時可以入住？',
      answer: '可入住日期以房源資料和當天床位狀況為準。選好預計入住日後搜尋，會先縮小合適範圍；正式出發或搬入前仍需再次確認。',
    },
    {
      question: '僱主可以一次安排多名員工嗎？',
      answer: '可以查詢團體住宿。請提供員工人數、男女比例、工作地點、入住日和預計租期，方便核對現有床位是否能安排在同一房源或鄰近地區。',
    },
    {
      question: '網站顯示的床位是否代表已經預留？',
      answer: '不是。網站顯示的是目前可供查詢的房源，不等於床位已鎖定。床位可能因其他安排而變動，必須完成確認程序後才算落實。',
    },
    {
      question: '怎樣確認房源仍有空位？',
      answer: '先用首頁搜尋房源，再從結果頁透過 WhatsApp 提供入住資料。我們會按房源紀錄核對床位、租金和入住條件；未確認前，請不要把網站結果視為最終安排。',
    },
  ],
  en: [
    {
      question: 'Who is monthly worker accommodation in Hong Kong for?',
      answer: 'Monthly worker accommodation is intended for people staying in Hong Kong for work. Employers may also enquire for newly arrived or shift-based staff. Each listing has its own occupancy rules, so include the group size, gender and expected move-in date in your enquiry.',
    },
    {
      question: 'Which Hong Kong districts are available?',
      answer: 'The site lists districts currently open for enquiry, such as Mong Kok, Jordan, Tsuen Wan or North Point. Options change with bed availability. Use the district filter first, then confirm the address and transport arrangements.',
    },
    {
      question: 'How much does a worker dormitory cost per month?',
      answer: 'Selected promotional beds start from HK$2,800 per month. The actual rent depends on the district, room type, number of beds and move-in date. Prices shown on listing pages are for enquiry and will be checked before an arrangement is confirmed.',
    },
    {
      question: 'Is a deposit or another fee required?',
      answer: 'Deposits, management charges and other fees vary by property. No payment is needed to submit an enquiry. Ask for a complete breakdown of the rent, deposit and any other charges before confirming.',
    },
    {
      question: 'Are male and female residents housed separately?',
      answer: 'Most properties are assigned by gender. You can filter the homepage by gender, but the room allocation must still be confirmed before move-in. Mention any group or special arrangement in your enquiry.',
    },
    {
      question: 'What is the minimum stay?',
      answer: 'The minimum stay is set for each property, and monthly arrangements are common. Known minimum-stay details are shown on the listing. If the work period is shorter or the dates are not final, submit the expected dates for checking.',
    },
    {
      question: 'How soon can a worker move in?',
      answer: 'The move-in date depends on the listing and the bed status on the day of enquiry. Search with the expected arrival date to narrow the results, then confirm again before travelling or moving in.',
    },
    {
      question: 'Can an employer arrange accommodation for a group?',
      answer: 'Yes, employers can enquire about group accommodation. Include the number of workers, gender mix, work location, move-in date and expected stay so the available beds can be checked in one property or nearby districts.',
    },
    {
      question: 'Does a listing mean the bed is already reserved?',
      answer: 'No. A listing means the property is open for enquiry; it does not hold a bed. Availability can change as other arrangements are made, and a bed is only secured after the confirmation process is complete.',
    },
    {
      question: 'How do I confirm that a bed is still available?',
      answer: 'Search the listings first, then send the move-in details through WhatsApp from the results section. The bed, rent and conditions will be checked against the property record. Treat the website result as a shortlist until that check is complete.',
    },
  ],
}

export function HomeFaq({ locale }: { locale: string }) {
  const language = locale === 'en' ? 'en' : 'zh-hk'
  const items = faqContent[language]
  const [openItem, setOpenItem] = useState<number | null>(0)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return <section className="home-faq bg-slate-50" aria-labelledby="home-faq-title">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold text-blue-700">{language === 'zh-hk' ? '入住前常見問題' : 'Frequently asked questions'}</p>
        <h2 id="home-faq-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {language === 'zh-hk' ? '香港外勞宿舍問答' : 'Hong Kong worker accommodation FAQ'}
        </h2>
        <p className="mt-4 leading-7 text-slate-600">
          {language === 'zh-hk'
            ? '先了解月租、地區、按金和入住流程，再按實際日期搜尋。'
            : 'Check the rent, districts, deposits and move-in process before searching with your dates.'}
        </p>
      </div>

      <div className="mt-10 grid gap-3">
        {items.map((item, index) => {
          const expanded = openItem === index
          const answerId = `home-faq-answer-${language}-${index}`
          return <article key={item.question} className={`home-faq-item ${expanded ? 'home-faq-item--open' : ''}`}>
            <h3>
              <button
                type="button"
                className="home-faq-toggle"
                aria-expanded={expanded}
                aria-controls={answerId}
                onClick={() => setOpenItem(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <span className="home-faq-toggle__icon" aria-hidden="true"><span /><span /></span>
              </button>
            </h3>
            <div id={answerId} hidden={!expanded} className="home-faq-answer">
              <p>{item.answer}</p>
            </div>
          </article>
        })}
      </div>
    </div>
  </section>
}
