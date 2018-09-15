namespace Shop.Models
{
    public class ErrorViewModel
    {
        public string Code { get; set; }

        public object Data { get; set; }
    }

    public class DictionaryCapacityError : ErrorViewModel
    {
        public DictionaryCapacityError(long expectedCapacity)
        {
            Code = "DICTIONARY_CAPACITY";
            Data = expectedCapacity;
        }
    }
}