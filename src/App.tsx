import { useState } from 'react';
import Modal from './components/Modal';
import TodoMap from './components/TodoMap';
import CategoryList from './components/CategoryList';
import ChatBubble from './components/ChatBubble';
import { Trash } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import { useTodos } from './hooks/useTodos';
import { useCategory } from './hooks/useCategory';
import { useChatbot } from './hooks/useChatbot';

// Funções utilitárias


function App() {
  // Estados
  const { categories, selectTodoCategory, selectedCategories,setCategories, setSelectTodoCategory, setSelectedCategories, addCategory, deleteCategory, saveSelectedCategories, handleToggleCategory } = useCategory()

  const { filteredTodos, setTodos, addTodo, deleteTodo, removeTodosByCategory, toggleTodoState } = useTodos({selectedCategories})

  const [newTodoText, setNewTodoText] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');

  const [categoryButtonState, setCategoryButtonState] = useState<'normal' | 'delete'>('normal');

  const [showModal, setShowModal] = useState(false);


  // Utiliza o novo custom hook para a lógica do chatbot
  const { messages, userInput, isLoading, handleKeyPress, handleSubmit, setUserInput } = useChatbot({
    categories,
    setCategories,
    setTodos,
    newCategoryName,
    selectTodoCategory,
  });

  // Renderização
  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white flex gap-[0%] flex-wrap content-start">
      <div className="w-[25auto] h-screen overflow-auto flex flex-col p-4 border-r-1 border-gray-800 pr-2">
        <div className="border-b-1 border-gray-800 pb-2 flex items-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
          >
            Nova Categoria
          </button>
          <button
            onClick={() => setCategoryButtonState(categoryButtonState === 'delete' ? 'normal' : 'delete')}
          >
            <Trash color={categoryButtonState === 'delete' ? 'red' : 'green'} />
          </button>
        </div>
        <CategoryList
          categories={categories.map(c => c.name)}
          selectedListCategory={selectedCategories}
          categoryButtonState={categoryButtonState}
          onCategoryClick={handleToggleCategory}
          onCategoryDelete={async (name) => {
            const cat = categories.find(c => c.name === name);
            if (cat) {
              await deleteCategory(cat.id, cat.name);
              await removeTodosByCategory(cat.name);
              const updatedSelected = selectedCategories.filter((cat) => cat !== name);
              setSelectedCategories(updatedSelected);
              await saveSelectedCategories(updatedSelected);
            }
          }}
        />
        <Modal
          show={showModal}
          title="Adicionar Categoria"
          inputValue={newCategoryName}
          onInputChange={(e) => setNewCategoryName(e.target.value)}
          onAdd={() => {addCategory(newCategoryName); setShowModal(false)}}
          onCancel={() => setShowModal(false)}
        />
      </div>

      {categories.length !== 0 && (
        <div className="grow h-3/4 w-auto p-4">
          <div className='border-b-1 border-gray-800 pb-1 flex justify-between'>
            <div>
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Nova tarefa"
                className="px-4 py-2 m-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {categories && (
                <select
                  value={selectTodoCategory}
                  onChange={(e) => setSelectTodoCategory(e.target.value)}
                  className="px-4 py-2 m-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => { addTodo(newTodoText, selectTodoCategory); setNewTodoText('') }}
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Adicionar
              </button>
            </div>
            <ThemeToggle />
          </div>
          <TodoMap
            todos={filteredTodos}
            onDeleteTodo={deleteTodo}
            onToggle={toggleTodoState}
          />
        </div>
      )}
      <div className='fixed bottom-10 right-10 w-90 max-h-100 bg-blue-700 text-white dark:bg-gray-800 rounded-2xl p-1'>
        <div className='overflow-auto max-h-80'>
          {messages.map((msg, index) => (
            <ChatBubble key={index} msg={msg} />
          ))}
          {isLoading && <p className="loading">Gerando resposta...</p>}
        </div>
        <div className='p-3 flex content-center'>
          <input
            className='px-4 py-2 mr-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Digite aqui (ex: 'Me faça um todo para como fazer uma aplicação React')"
          />
          <button onClick={handleSubmit} className='m-0 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
            enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;