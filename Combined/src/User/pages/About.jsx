import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'


const About = () => {
  return (
    <div>
          <div className='text-2xl text-center pt-8 border-t'>
              <Title text1={'ABOUT'} text2={'US'} />
          </div>
          <div className='my-10 flex flex-col md:flex-row gap-16'>
              <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
              <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti obcaecati minima aspernatur. Earum esse labore ducimus laborum quia quo vel itaque impedit unde eos deserunt quis saepe est, ut deleniti repellendus consequuntur aut eaque veritatis? Facere reprehenderit voluptatibus perferendis consequatur vitae.</p>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit debitis odio vero modi amet quidem voluptatum nesciunt illo perspiciatis nihil tempore eum, quis exercitationem accusantium. Eaque blanditiis excepturi ea voluptates autem!</p>
                  <b className='text-gray-800'>Our Mission</b>
                  <p>Our mission is to empower Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque commodi accusantium itaque a aut earum ab eveniet eaque, ipsum quam, atque porro magnam, sequi illo pariatur consequatur modi magni? Perspiciatis?
                  </p>
              </div>
          </div>
          <div className='text-xl py-4 '>
              <Title text1={'WHY'} text2={'CHOOSE US'} />
          </div>
          <div className='flex flex-col md:flex-row text-sm mb-20'>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                  <b>Qaulity Assurance : </b>
                  <p className='text-gray-600' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio deserunt nam labore facilis sit neque maxime sunt perspiciatis dolorum totam delectus repudiandae, inventore expedita quos atque voluptatum fugiat debitis architecto est!</p>
              </div>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                  <b>Convenience : </b>
                  <p className='text-gray-600' >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores blanditiis deserunt vero necessitatibus ab facere nemo aut harum sapiente itaque. Soluta?</p>
              </div>
              <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                  <b>Exceptional Customer Service : </b>
                  <p className='text-gray-600' >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo eius fugiat enim ipsum, quidem possimus consectetur inventore minima ratione sunt accusantium facilis hic, ab doloribus.</p>
              </div>
          </div>

    </div>
  )
}

export default About