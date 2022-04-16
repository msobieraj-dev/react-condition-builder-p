import { AppButton, DropdownBoolean, InputText, useManualUpdate } from "./components/shared.components"
import { ConditionBuilderRoot } from "./components/condition.components"
import { BuilderService, Arg } from "./services/builder.service"

/* ---------------------------------- NOTES --------------------------------- */
/* Solution is to use recursive component tree and use of sort of composite pattern for data structure.
This is my first react, but ive learn a lot of it, and i think my code base is pretty fine, 
and im willing to use rest of tools that react offers. 

I wanted to do this without any external libs, and i wanted to try similiar approch that ive constructed to be succesful
(easy to maintain and low-bugy for ~10 persons team) in angular over the years, 
so component represents only HTML structure and UI events, and theres service that operates all the logic and manipulates the data.
That keeps clean separation of concerns/resposibilites, and we can make use of 'js' feature like 'reference' etc.
(using child-parent data transfer is hard to maintain for longer chains that one link, it should be use only for generic non-bussines components)

How to upgrade the condition builder system? Whats the ideas for future? Move condition types to data/configuration 
and abstract logic/system to use of that configuration, so were be able to maintain only data, not code.

Other general ideas: component<->service, we can convert this.refreshFunc!() to decorator to get rid of this boilerplate code, 
also decorator for @Singleton pattern. In general convert boilerplate code to AOP.
And ofcourse some nice UI and css.

I would love to talk about my solution how its fits and what can be improved and more effecient
--> mateusz.sobieraj91@gmail.com
*/
/* ------------------------------ END OF NOTES ------------------------------ */

/* --------------------------------- PUBLIC --------------------------------- */
export default function App() {
  const serv = BuilderService.getInstance()
  const manualUpdate = useManualUpdate()
  serv.refreshFunc = () => manualUpdate() // can be used inside specific component for better performance

  return (
    <div>
      <ArgumentsRoot />

      <hr />

      <ConditionBuilderRoot />

      <hr />

      <ResultRoot />
    </div>
  );
}

/* --------------------------------- PRIVATE -------------------------------- */
function ArgumentsRoot() {
  const serv = BuilderService.getInstance()
  console.log(serv.conditions);
  

  const onChange = (i: number, arg: Arg) => {
    serv.updateArg(i, arg)
  }
  const onClick = () => {
    // need to handle not unique labels
    serv.addArg({ label: `arg${serv.args.length + 1}`, value: true })
  }

  const elements = serv.args.map((x, i) => {
    return (
      <div key={i}>
        <InputText value={x.label} onChange={(v) => onChange(i, { label: v, value: x.value })} />
        <DropdownBoolean value={x.value} onChange={(v) => onChange(i, { label: x.label, value: v })} />
      </div>
    )
  })

  return (
    <div>
      <div>
        {elements}
      </div>
      <AppButton text="Add arg" onClick={onClick} />
    </div>
  )
}

function ResultRoot() {
  const serv = BuilderService.getInstance()
  
  const root = serv.conditions[0]
  const result = root.evaluateFunc && root.evaluateFunc(root)?.toString()

  return (
    <div>Result: {result}</div>
  )
}