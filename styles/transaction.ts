import colors from '@/constants/color';
import { StyleSheet } from 'react-native';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop:50
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginRight: 8,
  },
  addButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.accentBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  reportCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  expenseSelected: {
    backgroundColor: '#EF4444',
  },
  incomeSelected: {
    backgroundColor: '#10B981',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 100,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Filter Modal Styles
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '90%',
    marginTop: 'auto',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
  },
  filterTypeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterTypeButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTypeSelected: {
    backgroundColor: '#8B5CF6',
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTypeTextSelected: {
    color: '#FFFFFF',
  },
  sortOptionsContainer: {
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sortButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  sortButtonFull: {
    alignSelf: 'flex-start',
  },
  sortButtonSelected: {
    backgroundColor: '#111827',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sortButtonTextSelected: {
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  categorySelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  categoryCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCountText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  categoryList: {
    maxHeight: 200,
    marginBottom: 24,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  applyButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    alignSelf: 'center',
  },
});
