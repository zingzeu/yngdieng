using System;

using Yngdieng.Protos;

namespace Yngdieng.Indexer {
    public sealed class CreateCikLinDocumentsAction {
        private readonly string _outputFolder;
        private readonly string _cikLinCsvFile;

        public CreateCikLinDocumentsAction(string cikLinCsvFile, string outputFolder)
        {
            _cikLinCsvFile = cikLinCsvFile;
            _outputFolder = outputFolder;
        }

        public void Run() {
            
        }
    }
}