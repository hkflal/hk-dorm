import Image from 'next/image'
import { 
  Shield, 
  Heart, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Award,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const metadata = {
  title: '關於我們 - 外勞宿舍',
  description: '了解外勞宿舍的使命、服務和團隊。我們致力於為香港的勞工和學生提供優質、安全、實惠的住宿解決方案。',
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-hk' }
  ]
}

export default function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const teamMembers = [
    {
      name: '陳志強',
      role: '創辦人兼執行長',
      bio: '擁有15年房地產和住宿服務經驗，致力於改善香港住宿市場',
      image: '/images/hero-dorm.jpg'
    },
    {
      name: '林美玲',
      role: '營運總監', 
      bio: '專精於住宿管理和客戶服務，確保每位住客都有賓至如歸的體驗',
      image: '/images/hero-dorm.jpg'
    },
    {
      name: '王建華',
      role: '技術總監',
      bio: '負責平台技術開發，打造便捷的線上預訂和管理系統',
      image: '/images/hero-dorm.jpg'
    }
  ]

  const achievements = [
    { icon: <Users className="w-8 h-8" />, number: '10,000+', label: '滿意住客' },
    { icon: <MapPin className="w-8 h-8" />, number: '500+', label: '合作房源' },
    { icon: <Star className="w-8 h-8" />, number: '4.8', label: '平均評分' },
    { icon: <Award className="w-8 h-8" />, number: '5+', label: '服務年資' }
  ]

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: '安全保障',
      description: '我們嚴格審查所有房源，確保住宿環境安全可靠，讓您安心入住'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: '貼心服務',
      description: '24/7客服支援，專業團隊隨時為您解決住宿相關問題'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: '社群連結',
      description: '建立住客社群，讓您在香港結識志同道合的朋友'
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: '品質承諾',
      description: '所有房源都經過實地考察，確保符合我們的品質標準'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              關於外勞宿舍
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              我們致力於為香港的勞工、學生和年輕專業人士提供優質、安全、實惠的住宿解決方案
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-lg">
                <Award className="w-5 h-5 mr-2" />
                香港註冊公司
              </Badge>
              <Badge className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                政府認可
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                我們的使命
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                外勞宿舍成立於2019年，源於創辦人在香港尋找合適住宿的困難經歷。我們深知在香港找到安全、實惠、位置便利的住宿是多麼不容易，特別是對於剛來港的勞工和學生。
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                因此，我們建立了這個平台，連接優質房東與有住宿需求的人們，並提供全方位的服務支援，讓每個人都能在香港找到溫暖的家。
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  <Clock className="w-4 h-4 mr-1" />
                  24小時客服
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  安全保障
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <Heart className="w-4 h-4 mr-1" />
                  用心服務
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12">
                <Image
                  src="/images/hero-dorm.jpg"
                  alt="外勞宿舍團隊"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我們的成就
            </h2>
            <p className="text-lg text-gray-600">
              數字見證我們的努力和成長
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-gray-600">
                    {achievement.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我們的核心價值
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              這些價值觀指導著我們的每一個決定和行動
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="text-blue-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我們的團隊
            </h2>
            <p className="text-lg text-gray-600">
              經驗豐富、充滿熱忱的專業團隊
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            想了解更多或需要協助？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            我們的團隊隨時準備為您提供專業的住宿建議和支援
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>+852 44130760</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>hk_labour_dorm@gmail.com</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Phone className="w-5 h-5 mr-2" />
              聯絡我們
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Mail className="w-5 h-5 mr-2" />
              發送郵件
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}