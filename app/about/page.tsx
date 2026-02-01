'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Recycle, ArrowLeft, Leaf, Mail, Linkedin, Github,
  GraduationCap, Lightbulb, Heart, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const teamMembers = [
  {
    name: 'Jaideep Aher',
    school: 'Pratt School of Engineering',
    role: 'Full-Stack Developer & System Design',
    bio: 'Passionate about using technology to solve environmental challenges. Leading the technical architecture and RFID integration for DukeReuse 360.',
    image: '/team/jaideep.jpg',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Aashish Yadav',
    school: 'Nicholas School of the Environment',
    role: 'Sustainability & UX Research',
    bio: 'Focused on environmental policy and sustainable systems. Driving the user research and environmental impact metrics for the project.',
    image: '/team/aashish.jpg',
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Jiyeong Pyo',
    school: 'Nicholas School of the Environment',
    role: 'Data Analytics & Impact Measurement',
    bio: 'Combining data science with environmental studies. Building the analytics dashboard and tracking our collective environmental impact.',
    image: '/team/jiyeong.jpg',
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Catherine Sutta',
    school: 'Nicholas School of the Environment',
    role: 'Operations & Community Engagement',
    bio: 'Dedicated to building sustainable communities. Managing pilot program operations and student outreach initiatives.',
    image: '/team/catherine.jpg',
    color: 'from-orange-500 to-red-600',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#001A57] rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-[#001A57]">DukeReuse 360</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Duke Climate & Sustainability Make-A-Thon 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#001A57] mb-6">
              Meet the Team Behind<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                DukeReuse 360
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re a team of Duke students passionate about sustainability,
              combining engineering innovation with environmental stewardship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Our Mission',
                description: 'Make sustainable dining the easiest choice for every Duke student through innovative technology.',
                color: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
              },
              {
                icon: Heart,
                title: 'Our Values',
                description: 'Sustainability, accessibility, and community-driven impact guide everything we build.',
                color: 'bg-red-100',
                iconColor: 'text-red-600',
              },
              {
                icon: Globe,
                title: 'Our Impact',
                description: 'Every container reused is a step toward a waste-free campus and a healthier planet.',
                color: 'bg-blue-100',
                iconColor: 'text-blue-600',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-[#001A57] mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-[#001A57] mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four Duke students from different schools, united by a shared vision for a sustainable future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`h-2 bg-gradient-to-r ${member.color}`} />
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Avatar placeholder */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl font-bold text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#001A57]">{member.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <GraduationCap className="w-4 h-4" />
                          {member.school}
                        </div>
                        <p className="text-sm font-medium text-green-600 mt-2">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 px-4 bg-[#001A57]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">About the Project</h2>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
              DukeReuse 360 was created for the Duke Climate & Sustainability Make-A-Thon 2026.
              Our goal is to revolutionize campus dining by making reusable containers convenient,
              trackable, and rewarding.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">48</div>
                <div className="text-blue-200">Hours to Build</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">4</div>
                <div className="text-blue-200">Team Members</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">1</div>
                <div className="text-blue-200">Shared Mission</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#001A57] mb-6">Get In Touch</h2>
          <p className="text-gray-600 mb-8">
            Interested in DukeReuse 360? Have questions about our pilot program?
            We&apos;d love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#pilot">
              <Button size="lg" className="bg-[#001A57] hover:bg-[#002D72]">
                Join the Pilot Program
              </Button>
            </Link>
            <a href="mailto:dukereuse360@duke.edu">
              <Button size="lg" variant="outline" className="gap-2">
                <Mail className="w-5 h-5" />
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-[#001A57]" />
              </div>
              <span className="font-bold text-xl">DukeReuse 360</span>
            </div>
            <div className="text-gray-400 text-sm">
              Duke Climate & Sustainability Make-A-Thon 2026
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            Skip the line, save the planet.
          </div>
        </div>
      </footer>
    </div>
  )
}
