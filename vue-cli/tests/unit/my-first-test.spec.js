import { shallowMount } from '@vue/test-utils'
import Pagination from '@/components/pagination.vue'

describe('Pagination.vue', () => {
  it('Check is Pagination instance of Vue', () => {
    const wrapper = shallowMount(Pagination, {
      propsData: {
        passParams: {
          amountRowsAll: 103,
          amountRowsPerPage: 10,
          numberCurrentPage: 1
        }
      }
    })
    expect(wrapper.isVueInstance()).toEqual(true)
  })

  it('Check input parameters of Pagination', () => {
    const wrapper = shallowMount(Pagination, {
      propsData: {
        passParams: {
          amountRowsAll: 103,
          amountRowsPerPage: 10,
          numberCurrentPage: 1
        }
      }
    })
    expect(wrapper.vm.passParams.numberCurrentPage).toBeDefined()

    wrapper.setProps({
      passParams: {
        amountRowsAll: 103,
        amountRowsPerPage: 10,
        numberCurrentPage: 7
      }
    })
    expect(wrapper.vm.passParams.numberCurrentPage).toEqual(7)
  })

  it('Check spans with class common-number-page and active-number-page are exists of Pagination', () => {
    const wrapper = shallowMount(Pagination, {
      propsData: {
        passParams: {
          amountRowsAll: 103,
          amountRowsPerPage: 10,
          numberCurrentPage: 1
        }
      }
    })

    expect(wrapper.contains('span.active-number-page')).toEqual(true)
    expect(wrapper.contains('span.common-number-page')).toEqual(true)
  })

  it('Check event of Pagination', () => {
    const wrapper = shallowMount(Pagination, {
      propsData: {
        passParams: {
          amountRowsAll: 103,
          amountRowsPerPage: 10,
          numberCurrentPage: 1
        }
      }
    })
    expect(wrapper.findAll('span.common-number-page').length).toEqual(11)

    wrapper
      .findAll('.common-number-page')
      .at(3 - 1)
      .trigger('click')
    expect(wrapper.emitted('page-choiced').length).toEqual(1)
    expect(wrapper.emitted('page-choiced')[0]).toEqual([3])
  })
})
