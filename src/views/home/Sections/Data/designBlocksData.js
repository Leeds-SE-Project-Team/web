/*
=========================================================
* Vue Material Kit 2 - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-material-kit-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// 获取服务端静态资源URL
const getStaticRes = (relativePath) => {
  return import.meta.env.APP_STATIC_URL.concat(relativePath)
}

const imagesPrefix = getStaticRes('/resource/home')
// '../src/views/home/Sections/Data/img'

import imgPricing from '@/assets/img/pricing.png'
import imgFeatures from '@/assets/img/features.png'
import imgBlogPosts from '@/assets/img/blog-posts.png'
import imgTestimonials from '@/assets/img/testimonials.png'
import imgTeam from '@/assets/img/team.png'
import imgStat from '@/assets/img/stat.png'
import imgContent from '@/assets/img/content.png'
import imgPagination from '@/assets/img/pagination.png'
import imgPopover from '@/assets/img/popovers.jpg'
import imgModal from '@/assets/img/modals.jpg'

export default [
  {
    heading: 'your tours',
    description: 'Tours can be either self-guided or conducted as part of a group.',
    id: 'id-tour',
    items: [
      {
        image: `${imagesPrefix}/tour.png`,
        title: 'Page Headers',
        subtitle: '10 Examples',
        route: 'home',
        pro: false
      },
      {
        image: imgFeatures,
        title: 'Features',
        subtitle: '14 Examples',
        route: 'home',
        pro: false
      },
      {
        image: imgPricing,
        title: 'Pricing',
        subtitle: '8 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/faq.jpg`,
        title: 'FAQ',
        subtitle: '1 Example',
        route: 'home',
        pro: true
      },
      {
        image: imgBlogPosts,
        title: 'Blog Posts',
        subtitle: '11 Examples',
        route: 'home',
        pro: true
      },
      {
        image: imgTestimonials,
        title: 'Testimonials',
        subtitle: '11 Examples',
        route: 'home',
        pro: true
      },
      {
        image: imgTeam,
        title: 'Teams',
        subtitle: '6 Examples',
        route: 'home',
        pro: true
      },
      {
        image: imgStat,
        title: 'Stats',
        subtitle: '3 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/call-to-action.jpg`,
        title: 'Call to Actions',
        subtitle: '8 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/projects.jpg`,
        title: 'Applications',
        subtitle: '6 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/logo-area.jpg`,
        title: 'Logo Areas',
        subtitle: '4 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/footers.jpg`,
        title: 'Footers',
        subtitle: '10 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/general-cards.jpg`,
        title: 'General Cards',
        subtitle: '9 Examples',
        route: 'home',
        pro: true
      },
      {
        image: imgContent,
        title: 'Content Sections',
        subtitle: '8 Examples',
        route: 'home',
        pro: true
      }
    ]
  },
  {
    heading: 'highlight',
    description: 'experiences worth special attention or capturing in photographs.',
    id: 'id-high',
    items: [
      {
        image: `${imagesPrefix}/high.png`,
        title: 'Navbars',
        subtitle: '4 Examples',
        route: 'home',
        pro: false
      },
      {
        image: `${imagesPrefix}/nav-tabs.jpg`,
        title: 'Nav Tabs',
        subtitle: '2 Nav Tabs',
        route: 'home',
        pro: false
      },
      {
        image: imgPagination,
        title: 'Pagination',
        subtitle: '3 Examples',
        route: 'home',
        pro: false
      }
    ]
  },
  {
    heading: 'Group',
    description:
      'These individuals can be family members, friends, colleagues, or strangers from different places who share the experience of the journey.',
    id: 'id-group',
    items: [
      {
        image: `${imagesPrefix}/gc.png`,
        title: 'Newsletters',
        subtitle: '6 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/contact-sections.jpg`,
        title: 'Contact Sections',
        subtitle: '8 Examples',
        route: 'home',
        pro: true
      },
      {
        image: `${imagesPrefix}/forms.jpg`,
        title: 'Forms',
        subtitle: '3 Examples',
        route: 'home',
        pro: false
      },
      {
        image: `${imagesPrefix}/inputs.jpg`,
        title: 'Inputs',
        subtitle: '6 Examples',
        route: 'home',
        pro: false
      }
    ]
  },
  {
    heading: 'collections',
    description:
      ' Collections enable travelers to browse and select tour options that suit their needs more easily.',
    id: 'id-collection',
    items: [
      {
        image: `${imagesPrefix}/collection.png`,
        title: 'Alerts',
        subtitle: '4 Examples',
        route: 'home',
        pro: false
      },
      {
        image: `${imagesPrefix}/toasts.jpg`,
        title: 'Notifications',
        subtitle: '3 Examples',
        route: 'home',
        pro: true
      },
      {
        image: imgPopover,
        title: 'Tooltips & Popovers',
        subtitle: '2 Examples',
        route: 'home',
        pro: false
      },
      {
        image: imgModal,
        title: 'Modals',
        subtitle: '5 Examples',
        route: 'home',
        pro: false
      }
    ]
  }
]
