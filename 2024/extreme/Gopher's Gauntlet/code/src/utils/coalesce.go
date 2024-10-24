package e_utils

func coalesce[T comparable](preference, fallback T) T {
	var zero T
	if preference == zero {
		return fallback
	}

	return preference
}

// Coalesce returns its left-most value if it's not zero value
func Coalesce[T comparable](vv ...T) T {
	var final T
	for _, v := range vv {
		final = coalesce(final, v)
	}

	return final
}
