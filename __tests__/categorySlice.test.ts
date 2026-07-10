import categoryReducer, {
  setCategories,
  addCategory,
  updateCategoryAction,
  removeCategory,
} from '../src/core/store/categorySlice';
import { Category } from '../src/core/database/schema';

describe('categorySlice', () => {
  const initialState = { categories: [] };
  const mockCategory: Category = {
    id: '1',
    name: 'Food',
    icon: 'restaurant',
    color: '#FF0000',
    type: 'debit',
    created_at: 1000,
    sync_status: 'synced',
    updated_at: 1000
  };

  it('should handle initial state', () => {
    expect(categoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCategories', () => {
    const actual = categoryReducer(initialState, setCategories([mockCategory]));
    expect(actual.categories).toEqual([mockCategory]);
  });

  it('should handle addCategory', () => {
    const actual = categoryReducer(initialState, addCategory(mockCategory));
    expect(actual.categories).toEqual([mockCategory]);
  });

  it('should handle updateCategoryAction', () => {
    const stateWithCategory = { categories: [mockCategory] };
    const updatedCategory = { ...mockCategory, name: 'Dining' };
    
    const actual = categoryReducer(stateWithCategory, updateCategoryAction(updatedCategory));
    expect(actual.categories[0].name).toBe('Dining');
  });

  it('should not update if category not found', () => {
    const stateWithCategory = { categories: [mockCategory] };
    const nonExistentCategory = { ...mockCategory, id: '99', name: 'None' };
    
    const actual = categoryReducer(stateWithCategory, updateCategoryAction(nonExistentCategory));
    expect(actual.categories[0].name).toBe('Food');
  });

  it('should handle removeCategory', () => {
    const stateWithCategory = { categories: [mockCategory] };
    const actual = categoryReducer(stateWithCategory, removeCategory('1'));
    expect(actual.categories.length).toBe(0);
  });
});
