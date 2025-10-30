# State-of-the-Art in Multimodal Emotion Fusion: 2023-2025

This report provides a detailed summary of advanced techniques for multimodal emotion recognition (MER), focusing on the fusion of text, audio, and visual data. It analyzes fusion architectures developed between 2023 and 2025, their methods for handling conflicting emotional cues, performance on standard benchmarks, and their suitability for real-time applications.

## 1. Advanced Multimodal Fusion Techniques (2023-2025)

Recent advancements in MER have moved beyond simple fusion to more sophisticated, deeply integrated architectures. The dominant trends involve transformer-based models, graph neural networks, and methods guided by large language models (LLMs) [ref: 0-0, ref: 0-2].

### Transformer-Based and Attention Mechanisms
Transformers are central to modern MER due to their ability to model complex dependencies [ref: 0-0].

*   **Cross-Modal Attention**: This mechanism is widely used to fuse information and model the heterogeneity between modalities [ref: 0-0]. It allows features from one modality to query another, capturing interdependencies [ref: 1-2]. One 2024 study proposed a model using a multi-head cross-attention layer to fuse text and audio features, followed by a self-attention layer to enrich the combined representation [ref: 0-1].
*   **Hierarchical and Staged Fusion**: The MERITS-L model (2025) exemplifies a hierarchical approach. It first trains unimodal models at the utterance level, then models the conversational context with a Bi-GRU, and finally fuses the modalities using a co-attention network [ref: 1-0]. This staged training process has been shown to prevent overfitting and yield better performance than non-hierarchical, end-to-end training [ref: 1-0].
*   **Advanced Hybrid Architectures**: A 2025 framework integrates a Hierarchical Attention-based Graph Neural Network (HAN-GNN) to model structural dependencies with a Cross-Modality Transformer Fusion (XMTF) for adaptive information integration [ref: 1-1]. Another approach from 2025 evaluated various feature-level fusion methods, including Principal Component Analysis (PCA), autoencoders (AE), and EmbraceNet, with a Long Short-Term Memory (LSTM) network to capture temporal dynamics [ref: 0-4].

### Graph-Based Methods
Dialogues are naturally suited to graph structures, and Graph Neural Networks (GNNs) are effective at modeling the complex interaction patterns in conversations [ref: 0-0].

*   **Standard and Hypergraph GNNs**: DialogueGCN was a pioneering model that introduced GNNs to the field [ref: 0-1]. More recent methods use GNNs to fuse multimodal features and incorporate speaker information [ref: 0-0]. To handle challenges like missing modalities, researchers have employed Hypergraph Neural Networks, which can connect multiple modalities or utterance nodes simultaneously to capture higher-order interactions [ref: 0-0].
*   **Fourier Graph Neural Networks**: To combat the over-smoothing problem in deep GNNs, the GS-MMC model uses a Fourier graph operator. This allows the model to extract both high-frequency (local variations) and low-frequency (global semantic trends) emotional signals from the frequency domain, improving the recognition of true emotional states [ref: 0-0].

### LLM and Prompt-Based Methods
The capabilities of Large Language Models (LLMs) and Multimodal LLMs (MLLMs) are increasingly being harnessed for MER.

*   **LLM-Guided Pre-training**: The MERITS-L model introduces a novel pre-training strategy where a text-based LLM (GPT-3.5) generates pseudo-labels for a large corpus of unlabeled speech transcripts. A RoBERTa model is then fine-tuned on this pseudo-labeled data, creating a powerful, context-aware text encoder without manually annotated data [ref: 1-0].
*   **Dynamic Prompt Engineering (DPE)**: A 2025 framework uses DPE to adaptively refine prompts for modality-specific encoders like Mistral-7B (text), HuBERT (audio), and TimeSformer (video). This technique guides the models to extract more relevant and fine-grained emotional features based on the input's context [ref: 1-1].
*   **Lightweight Adaptation**: To address the high computational cost of LLMs, researchers are developing lightweight plug-in architectures. The MSE-Adapter, for example, is a plug-in module designed for efficient and multimodally-aware emotion recognition that works with a frozen LLM backbone [ref: 0-0].

### Multi-Task Learning with Mixture of Experts
*   **MMoLRE (Multimodal Mixture of Low-Rank Experts)**: This 2025 model jointly trains for Multimodal Sentiment Analysis (MSA) and MER [ref: 1-2]. It uses a Mixture of Experts (MoE) architecture with both shared and task-specific low-rank experts. This design avoids negative interference between tasks and significantly reduces parameter count and computational overhead compared to standard MoE models [ref: 1-2].

## 2. Handling Incongruent and Conflicting Emotional Signals

A core challenge in MER is resolving conflicting cues, such as sarcastic text paired with a neutral tone. Modern techniques address this through several mechanisms.

*   **Attention Mechanisms**: Cross-attention can dynamically adjust the weight of each modality based on context, allowing the model to focus on the most reliable cues while suppressing noise [ref: 0-2, ref: 1-1]. For instance, an attention-based model might learn to prioritize strong facial expressions over ambiguous vocal tones, or vice versa [ref: 0-2]. The belief is that cross-attention fusion is capable of making sense of confusing and contradicting data by capturing the interactions between modalities [ref: 0-1].
*   **Specialized Architectures**:
    *   **Mixture of Experts (MoE)**: The MMoLRE framework is designed to prevent "harmful interference" by using separate experts to model task-specific and shared knowledge [ref: 1-2]. This principle of disentanglement can help the model handle conflicting information within the data.
    *   **Graph-Based Models**: Fourier GNNs can separate high-frequency and low-frequency emotional signals, which helps in capturing both global trends and subtle local variations that might be in conflict [ref: 0-0].
*   **Contrastive Learning**: This technique is used to improve the separation between different emotion classes in the feature space. By training the model to pull representations of the same emotion closer while pushing different ones apart, it enhances robustness, especially when signals are ambiguous or conflicting [ref: 1-1]. A contrastive learning mechanism can also be used to enhance the semantic consistency and complementarity of signals in a self-supervised manner [ref: 0-0].
*   **Hierarchical Processing**: The staged training approach used by models like MERITS-L ensures that high-quality, context-aware unimodal representations are learned before the fusion stage [ref: 1-0]. This provides the final fusion layer with more refined inputs, which can simplify the task of resolving incongruence [ref: 1-0].
*   **Text-Dominant Strategies**: Some models treat text as the primary modality and use audio or visual data as auxiliary signals. In these architectures, the weaker modalities can be used as "multimodal prompts" or to perform deep emotional cue extraction to enhance the features of the primary text modality [ref: a0-0].

## 3. Performance Benchmarks and Computational Costs

State-of-the-art models are primarily evaluated on benchmark datasets like MELD, IEMOCAP, and CMU-MOSI/MOSEI using metrics such as Weighted Average F1-Score (W-F1) and Accuracy (Acc).

### Performance on Standard Datasets

| Model | Dataset | Metric | Score | Reference |
|---|---|---|---|---|
| Wafa et al. (2025) | IEMOCAP | Accuracy | 99.82% | [ref: 1-1] |
| MERITS-L (2025) | IEMOCAP | W-F1 | 86.48% | [ref: 1-0] |
| Wafa et al. (2025) | MELD | Accuracy | 99.81% | [ref: 1-1] |
| Elabd & Jaf (2024) | MELD | W-F1 | 69.7% | [ref: 0-1] |
| MERITS-L (2025) | MELD | W-F1 | 66.02% | [ref: 1-0] |
| MERITS-L (2025) | CMU-MOSI | W-F1 | 86.81% | [ref: 1-0] |
| MMoLRE (2025) | CMU-MOSEI | Avg WF1 (MER) | 79.5% | [ref: 1-2] |
| MMoLRE (2025) | CMU-MOSEI | Acc7 (MSA) | 55.78% | [ref: 1-2] |

*Note: The accuracy figures from Wafa et al. (2025) are exceptionally high compared to other contemporary research and should be considered with caution.*

### Computational Costs and Efficiency

*   **High-Cost Models**: Approaches that leverage large language models (LLMs) are powerful but come with significant computational resource demands [ref: 0-0, ref: 1-0].
*   **Efficient Alternatives**: To address computational overhead, researchers are developing more efficient models.
    *   The **MMoLRE** model uses a low-rank expert structure, which results in over 80% parameter savings and a 5.9x reduction in FLOPs compared to a standard Mixture of Experts framework [ref: 1-2].
    *   Lightweight, plug-in architectures like **MSE-Adapter** are designed to add multimodal capabilities to frozen LLM backbones with minimal computational cost [ref: 0-0].
*   **Real-World Deployment**: Some models are designed with practical deployment in mind. The framework by Wafa et al. (2025) is exported to the ONNX format to support low-latency inference [ref: 1-1]. The work by Elabd & Jaf (2024) was conducted on a single 12GB NVIDIA GPU, providing a practical benchmark for hardware requirements [ref: 0-1].

## 4. Fusion Strategies for Real-Time Applications

The choice of fusion strategy has significant implications for a model's performance, robustness, and suitability for real-time deployment in an interactive web application.

### Comparison of Fusion Strategies

| Fusion Strategy | Advantages | Disadvantages |
|---|---|---|
| **Early Fusion** (Feature-Level) | Can capture low-level, synergistic interactions between modalities [ref: 0-2]. | Highly sensitive to data synchronization and temporal misalignment [ref: 0-2]. Can create high-dimensional, redundant feature vectors [ref: 0-4]. Less flexible when a modality is missing or noisy [ref: 0-0]. |
| **Late Fusion** (Decision-Level) | More flexible and robust to missing or noisy modalities since unimodal models are trained independently [ref: 0-2]. Simpler to implement [ref: 0-2]. | May fail to capture subtle cross-modal interactions that occur at the feature level [ref: 0-2]. Simple fusion rules (e.g., voting) can be suboptimal [ref: 0-1]. |
| **Hybrid Fusion** (Intermediate) | Combines the strengths of early and late fusion by integrating modalities at intermediate stages [ref: 0-2]. This is the dominant approach in state-of-the-art models, using mechanisms like cross-attention and GNNs to allow for complex, dynamic interactions [ref: 0-0, ref: 0-1]. | Can be significantly more complex to design, train, and optimize [ref: 0-2]. May have higher computational costs than simpler fusion methods. |

### Suitability for Real-Time Deployment

For an interactive web application, latency, robustness, and computational efficiency are paramount.

*   **Latency and Efficiency**: While complex hybrid models offer the best performance, their latency can be prohibitive. The development of **lightweight architectures** like the MSE-Adapter and efficient designs like MMoLRE's low-rank experts are critical for real-time feasibility [ref: 0-0, ref: 1-2]. Exporting models to optimized formats like **ONNX** is a practical step to ensure low-latency inference on client or server-side applications [ref: 1-1].
*   **Robustness to Missing Data**: In a real-world web application, users may disable their camera or microphone. Late fusion is inherently more robust to this scenario [ref: 0-2]. Some modern hybrid models, such as **EmbraceNet**, are also designed to handle missing input embeddings gracefully, making them suitable for such dynamic conditions [ref: 0-4].
*   **Conclusion on Strategy**: A **hybrid fusion** strategy is the most promising for achieving high accuracy. However, for a real-time web application, this must be paired with a focus on **model efficiency**. A practical solution would involve a lightweight hybrid model, potentially using techniques like low-rank approximation or knowledge distillation, that is robust to missing modalities and optimized for fast inference.