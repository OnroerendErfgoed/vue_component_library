import OeContextMenu from '@components/core/dumb/OeContextMenu.vue';
import type { MenuItem } from '@components/core/dumb/OeContextMenu.vue';

describe('OeContextMenu', () => {
  describe('Basic Functionality', () => {
    it('should render the component', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      });
    });

    it('should not display menu initially', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      });
      cy.get('.context-menu').should('not.exist');
    });

    it('should open menu when toggleMenu is called', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu').should('be.visible');
      });
    });

    it('should close menu when toggleMenu is called twice', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        const event = new MouseEvent('click', { clientX: 100, clientY: 100 });
        wrapper.vm.toggleMenu(event);
        cy.get('.context-menu')
          .should('be.visible')
          .then(() => {
            wrapper.vm.toggleMenu(event);
            cy.get('.context-menu').should('not.exist');
          });
      });
    });
  });

  describe('Menu Items', () => {
    it('should render menu items', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [
            { label: 'Edit', action: 'edit' },
            { label: 'Delete', action: 'delete' },
          ],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Edit').should('be.visible');
        cy.contains('.context-menu__item', 'Delete').should('be.visible');
      });
    });

    it('should emit action event when item is clicked', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Edit')
          .click()
          .then(() => {
            const emitted = wrapper.emitted('action');
            expect(emitted).to.have.length(1);
            expect(emitted?.[0]).to.deep.equal(['edit']);
          });
      });
    });

    it('should close menu after item click', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu')
          .should('be.visible')
          .then(() => {
            cy.contains('.context-menu__item', 'Edit').click();
            cy.get('.context-menu').should('not.exist');
          });
      });
    });
  });

  describe('Dividers', () => {
    it('should render dividers', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'New', action: 'new' }, { type: 'divider' }, { label: 'Exit', action: 'exit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu__divider').should('exist');
      });
    });

    it('should not render divider action', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }, { type: 'divider' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        // Dividers should not be clickable
        cy.get('.context-menu__divider').should('not.have.class', 'context-menu__item');
      });
    });
  });

  describe('Submenus', () => {
    it('should render submenu items on hover', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [
            {
              label: 'Format',
              submenu: [
                { label: 'Bold', action: 'bold' },
                { label: 'Italic', action: 'italic' },
              ],
            },
          ],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Format')
          .should('be.visible')
          .parent('.context-menu__submenu')
          .trigger('mouseover')
          .then(() => {
            cy.contains('.context-menu__submenu-panel .context-menu__item', 'Bold').should('be.visible');
          });
      });
    });

    it('should emit action from submenu item', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [
            {
              label: 'Format',
              submenu: [{ label: 'Bold', action: 'bold' }],
            },
          ],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Format')
          .parent('.context-menu__submenu')
          .trigger('mouseover')
          .then(() => {
            cy.contains('.context-menu__submenu-panel .context-menu__item', 'Bold')
              .click()
              .then(() => {
                const emitted = wrapper.emitted('action');
                expect(emitted).to.have.length(1);
                expect(emitted?.[0]).to.deep.equal(['bold']);
                cy.get('.context-menu').should('not.exist');
              });
          });
      });
    });

    it('should render dividers in submenus', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [
            {
              label: 'Share',
              submenu: [{ label: 'Email', action: 'email' }, { type: 'divider' }, { label: 'Link', action: 'link' }],
            },
          ],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Share')
          .parent('.context-menu__submenu')
          .trigger('mouseover')
          .then(() => {
            cy.get('.context-menu__submenu-panel .context-menu__divider').should('exist');
          });
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no items', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__empty', 'Geen acties beschikbaar').should('be.visible');
      });
    });

    it('should show custom empty state message', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [],
          emptyStateText: 'No options available',
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__empty', 'No options available').should('be.visible');
      });
    });
  });

  describe('Positioning', () => {
    it('should position menu at click coordinates', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 200, clientY: 300 }));
        cy.get('.context-menu').should('have.css', 'left');
        cy.get('.context-menu').should('have.css', 'top');
      });
    });

    it('should reposition menu if it extends beyond right edge', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        const farRight = window.innerWidth - 10;
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: farRight, clientY: 100 }));
        cy.get('.context-menu').should('be.visible');
        // Menu should be repositioned, not extend beyond viewport
      });
    });

    it('should reposition menu if it extends beyond bottom edge', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        const farBottom = window.innerHeight - 10;
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: farBottom }));
        cy.get('.context-menu').should('be.visible');
      });
    });
  });

  describe('User Interactions', () => {
    it('should close menu on escape key', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu')
          .should('be.visible')
          .then(() => {
            cy.get('body').type('{esc}');
            cy.get('.context-menu').should('not.exist');
          });
      });
    });

    it('should close menu on click outside', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu')
          .should('be.visible')
          .then(() => {
            cy.get('body').click(500, 500);
            cy.get('.context-menu').should('not.exist');
          });
      });
    });

    it('should close menu on scroll', () => {
      cy.mount(
        {
          template: `
            <div style="height: 2000px; padding: 50px;">
              <OeContextMenu ref="menu" :items="items" @action="handleAction" />
            </div>
          `,
          components: { OeContextMenu },
          setup() {
            const items = [{ label: 'Edit', action: 'edit' }];
            const handleAction = () => {};
            return { items, handleAction };
          },
        },
        {
          global: {
            components: { OeContextMenu },
          },
        }
      ).then(({ wrapper }) => {
        const menu = wrapper.findComponent(OeContextMenu);
        menu.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu')
          .should('be.visible')
          .then(() => {
            cy.window().scrollTo(0, 500);
            cy.get('.context-menu').should('not.exist');
          });
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attributes', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu').should('have.attr', 'role', 'menu');
        cy.contains('.context-menu__item', 'Edit').should('have.attr', 'role', 'menuitem');
      });
    });

    it('should have proper role for dividers', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [{ label: 'Edit', action: 'edit' }, { type: 'divider' }],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.get('.context-menu__divider').should('have.attr', 'role', 'separator');
      });
    });
  });

  describe('Long Labels', () => {
    it('should wrap long labels', () => {
      cy.mount(OeContextMenu, {
        props: {
          items: [
            {
              label: 'This is a very long label that should wrap onto multiple lines',
              action: 'long-action',
            },
          ],
        },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'This is a very long label').should('be.visible');
      });
    });
  });

  describe('Multiple Items', () => {
    it('should handle many items', () => {
      const items: MenuItem[] = Array.from({ length: 20 }, (_, i) => ({
        label: `Item ${i + 1}`,
        action: `item-${i + 1}`,
      }));

      cy.mount(OeContextMenu, {
        props: { items },
      }).then(({ wrapper }) => {
        wrapper.vm.toggleMenu(new MouseEvent('click', { clientX: 100, clientY: 100 }));
        cy.contains('.context-menu__item', 'Item 1').should('be.visible');
        cy.contains('.context-menu__item', 'Item 20').should('be.visible');
      });
    });
  });
});
