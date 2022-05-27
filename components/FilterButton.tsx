import {Filter} from '../helpers/constants'

type FilterButtonProps = {
  filter: Filter
  setFilter: (arg0:Filter)=>void
}

const FilterButton = ({ filter, setFilter }: FilterButtonProps): JSX.Element => {

  return (
    <button
      className="inline-flex items-center h-7 md:h-6 px-4 py-1 my-4 bg-p-400 border border-p-300 hover:bg-p-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:ring-offset-p-600 focus-visible:border-n-100 focus-visible:outline-none active:bg-p-500 active:border-p-500 active:ring-0 text-sm md:text-xs md:font-semibold tracking-wide text-white rounded"
      onClick={ () => { switch(filter) {
          case Filter.All: setFilter(Filter.Connected)
            break
          case Filter.Connected: setFilter(Filter.Invites)
            break
          case Filter.Invites: setFilter(Filter.All)
            break
        }
      }
    }
    >
      {filter===Filter.Connected ? "Connections only" : (filter===Filter.All ?"All peers" : "Invites" )}
    </button>
  )

}


export default FilterButton
