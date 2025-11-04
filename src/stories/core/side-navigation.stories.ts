import { vueRouter } from 'storybook-vue3-router';
import { OeSideNavigation } from '@components/core';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof OeSideNavigation> = {
  title: 'Core Module/Side Navigation',
  component: OeSideNavigation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A side navigation component for navigating between sections and links.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OeSideNavigation>;

const sideNavigation = [
  {
    text: 'Section 1',
    ref: 'section1',
    links: [
      { name: 'home', label: 'Home' },
      { name: 'about', label: 'About' },
      { name: 'contact', label: 'Contact' },
      { name: 'help', label: 'Help' },
    ],
  },
  {
    text: 'Section 2',
    ref: 'section2',
    links: [
      { name: 'overview', label: 'Overview' },
      { name: 'details', label: 'Details' },
    ],
  },
];

export const Default: Story = {
  decorators: [
    vueRouter(
      [
        {
          path: '/section1',
          name: 'section1',
          component: { template: '<div>Section 1</div>' },
          children: [
            { path: 'home', name: 'home', component: { template: '<div>Home</div>' } },
            { path: 'about', name: 'about', component: { template: '<div>About</div>' } },
            { path: 'contact', name: 'contact', component: { template: '<div>Contact</div>' } },
            { path: 'help', name: 'help', component: { template: '<div>Help</div>' } },
          ],
        },
        {
          path: '/section2',
          name: 'section2',
          component: { template: '<div>Section 2</div>' },
          children: [
            { path: 'overview', name: 'overview', component: { template: '<div>Overview</div>' } },
            { path: 'details', name: 'details', component: { template: '<div>Details</div>' } },
          ],
        },
      ],
      { initialRoute: '/section1/home' }
    ),
  ],
  render: () => ({
    components: { OeSideNavigation },
    setup() {
      const routeMatches = [{ name: 'section1' }, { name: 'home' }];
      const onNavigate = (name: string) => {
        console.log('Navigated to:', name);
      };
      return { sideNavigation, routeMatches, onNavigate };
    },
    template: `<OeSideNavigation :sideNavigation="sideNavigation" :routeMatches="routeMatches" :onNavigate="onNavigate" />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Default side navigation with two sections and navigation links. The active route is passed via the `routeMatches` prop.',
      },
    },
  },
};

export const NoAutoExpand: Story = {
  decorators: Default.decorators,
  render: () => ({
    components: { OeSideNavigation },
    setup() {
      const routeMatches = [{ name: 'section1' }, { name: 'home' }];
      const onNavigate = (name: string) => {
        console.log('Navigated to:', name);
      };
      return { sideNavigation, routeMatches, onNavigate };
    },
    template: `<OeSideNavigation :sideNavigation="sideNavigation" :routeMatches="routeMatches" :onNavigate="onNavigate" :autoExpand="false" />`,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Side navigation with autoExpand set to false. The active route is passed via the `routeMatches` prop.',
      },
    },
  },
};
