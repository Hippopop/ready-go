import { StyleSheet } from '@react-pdf/renderer'

// Common styles reused across templates
export const shared = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  chip: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 4,
    marginTop: 3,
  },
  sectionGap: {
    marginBottom: 14,
  },
  itemGap: {
    marginBottom: 10,
  },
  link: {
    color: '#4F46E5',
    textDecoration: 'none',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
  },
})
