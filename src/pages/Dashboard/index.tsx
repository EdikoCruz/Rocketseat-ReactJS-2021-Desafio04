import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodType {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

interface DashboardProps {

} 

function Dashboard (props: DashboardProps) {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then(r => r.data).then(setFoods);
  }, [])

  function handleAddFood(food:FoodType) {
    api.post('/foods', {
      ...food,
      available: true,
    })
    .then(r => r.data)
    .then(food => setFoods(foods => [...foods, food]))
    .catch(console.log);
  }

  function handleUpdateFood(food:FoodType) {

    api.put(
      `/foods/${editingFood.id}`,
      { ...editingFood, ...food },
    )
    .then(r => r.data)
    .then(foodUpdated => {
      setFoods(foods => foods.map(f =>
        f.id !== foodUpdated.id ? f : foodUpdated,
      ))
    })
    .catch(console.log);
  }

  function handleDeleteFood(id: number) {
    api.delete(`/foods/${id}`)
    .then(() => setFoods(foods => foods.filter(food => food.id !== id)))
  }

  function toggleModal() {
    setModalOpen(s => !s);
  }

  function toggleEditModal() {
    setEditModalOpen(s => !s)
  }

  function handleEditFood(food:FoodType)  {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard;
